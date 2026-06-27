from django.db import transaction
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from actions.models import ActionItem
from actions.serializers import ActionItemSerializer
from summaries.models import Summary
from summaries.serializers import SummarySerializer
from summaries.services import regenerate_summary
from transcripts.models import TranscriptSegment
from transcripts.serializers import TranscriptSegmentSerializer
from transcripts.services import parse_transcript_payload

from .models import Meeting
from .serializers import MeetingDetailSerializer, MeetingListSerializer, MeetingWriteSerializer


class MeetingCollectionView(APIView):
    def get(self, request):
        meetings = Meeting.objects.prefetch_related("participants").select_related("summary").annotate(action_count=Count("action_items"))
        search = request.query_params.get("search", "").strip()
        if search:
            meetings = meetings.filter(Q(title__icontains=search) | Q(participants__name__icontains=search)).distinct()
        date_value = request.query_params.get("date", "").strip()
        if date_value:
            parsed_date = parse_date(date_value)
            if parsed_date:
                meetings = meetings.filter(meeting_date__date=parsed_date)
        sort = request.query_params.get("sort", "recent")
        meetings = meetings.order_by("meeting_date" if sort == "oldest" else "-meeting_date")
        return Response(MeetingListSerializer(meetings, many=True).data)

    @transaction.atomic
    def post(self, request):
        serializer = MeetingWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        meeting = serializer.save()
        if request.data.get("text") or request.data.get("transcript") or request.data.get("vtt") or request.data.get("segments"):
            _replace_transcript(meeting, request.data)
            regenerate_summary(meeting)
        else:
            Summary.objects.create(
                meeting=meeting,
                overview="Summary will appear after a transcript is added.",
                key_topics=["Follow-Up"],
                decisions=["Add transcript content to generate notes."],
            )
        return Response(MeetingDetailSerializer(meeting).data, status=status.HTTP_201_CREATED)


class MeetingDetailView(APIView):
    def get(self, _request, meeting_id: int):
        meeting = _get_meeting(meeting_id)
        return Response(MeetingDetailSerializer(meeting).data)

    def put(self, request, meeting_id: int):
        meeting = _get_meeting(meeting_id)
        serializer = MeetingWriteSerializer(meeting, data=request.data)
        serializer.is_valid(raise_exception=True)
        meeting = serializer.save()
        return Response(MeetingDetailSerializer(meeting).data)

    def delete(self, _request, meeting_id: int):
        _get_meeting(meeting_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TranscriptView(APIView):
    def get(self, _request, meeting_id: int):
        meeting = _get_meeting(meeting_id)
        segments = meeting.transcript_segments.all()
        return Response(TranscriptSegmentSerializer(segments, many=True).data)

    def post(self, request, meeting_id: int):
        meeting = _get_meeting(meeting_id)
        segments = _replace_transcript(meeting, request.data)
        regenerate_summary(meeting)
        return Response(TranscriptSegmentSerializer(segments, many=True).data, status=status.HTTP_201_CREATED)


class TranscriptSearchView(APIView):
    def get(self, request, meeting_id: int):
        meeting = _get_meeting(meeting_id)
        query = request.query_params.get("q", "").strip()
        if not query:
            return Response([])
        matches = meeting.transcript_segments.filter(transcript_text__icontains=query)
        return Response(TranscriptSegmentSerializer(matches, many=True).data)


class SummaryView(APIView):
    def get(self, _request, meeting_id: int):
        meeting = _get_meeting(meeting_id)
        summary = getattr(meeting, "summary", None)
        if not summary:
            summary = regenerate_summary(meeting)
        return Response(SummarySerializer(summary).data)


class SummaryRegenerateView(APIView):
    def post(self, _request, meeting_id: int):
        meeting = _get_meeting(meeting_id)
        summary = regenerate_summary(meeting)
        return Response(SummarySerializer(summary).data)


class MeetingActionCollectionView(APIView):
    def get(self, _request, meeting_id: int):
        meeting = _get_meeting(meeting_id)
        return Response(ActionItemSerializer(meeting.action_items.all(), many=True).data)

    def post(self, request, meeting_id: int):
        meeting = _get_meeting(meeting_id)
        serializer = ActionItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        action = serializer.save(meeting=meeting)
        return Response(ActionItemSerializer(action).data, status=status.HTTP_201_CREATED)


class ActionDetailView(APIView):
    def put(self, request, action_id: int):
        action = get_object_or_404(ActionItem, pk=action_id)
        serializer = ActionItemSerializer(action, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        return Response(ActionItemSerializer(serializer.save()).data)

    def delete(self, _request, action_id: int):
        get_object_or_404(ActionItem, pk=action_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


def _get_meeting(meeting_id: int) -> Meeting:
    return get_object_or_404(
        Meeting.objects.prefetch_related("participants", "transcript_segments", "action_items").select_related("summary"),
        pk=meeting_id,
    )


def _replace_transcript(meeting: Meeting, payload: dict) -> list[TranscriptSegment]:
    parsed_segments = parse_transcript_payload(payload)
    if not parsed_segments:
        from rest_framework.exceptions import ValidationError

        raise ValidationError({"transcript": "At least one transcript segment is required."})
    previous_start = -1
    for segment in parsed_segments:
        if segment["start_time_seconds"] < previous_start:
            from rest_framework.exceptions import ValidationError

            raise ValidationError({"transcript": "Transcript timestamps must be chronological."})
        previous_start = segment["start_time_seconds"]
    meeting.transcript_segments.all().delete()
    created = [
        TranscriptSegment(
            meeting=meeting,
            speaker_name=segment["speaker_name"],
            start_time_seconds=segment["start_time_seconds"],
            end_time_seconds=segment["end_time_seconds"],
            transcript_text=segment["transcript_text"],
        )
        for segment in parsed_segments
        if segment["transcript_text"].strip()
    ]
    return TranscriptSegment.objects.bulk_create(created)
