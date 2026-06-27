from django.db import transaction
from rest_framework import serializers

from actions.serializers import ActionItemSerializer
from summaries.serializers import SummarySerializer
from transcripts.serializers import TranscriptSegmentSerializer

from .models import Meeting, Participant


class ParticipantNameField(serializers.ListField):
    child = serializers.CharField(max_length=120)

    def to_representation(self, value):
        return [participant.name for participant in value.all()]


class MeetingListSerializer(serializers.ModelSerializer):
    participants = ParticipantNameField(read_only=True)
    summary_preview = serializers.SerializerMethodField()
    action_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Meeting
        fields = ["id", "title", "duration_seconds", "meeting_date", "participants", "summary_preview", "action_count"]

    def get_summary_preview(self, obj: Meeting) -> str:
        summary = getattr(obj, "summary", None)
        if not summary:
            return ""
        return summary.overview[:150]


class MeetingDetailSerializer(serializers.ModelSerializer):
    participants = ParticipantNameField(read_only=True)
    transcript_segments = TranscriptSegmentSerializer(many=True, read_only=True)
    summary = SummarySerializer(read_only=True)
    action_items = ActionItemSerializer(many=True, read_only=True)

    class Meta:
        model = Meeting
        fields = [
            "id",
            "title",
            "duration_seconds",
            "meeting_date",
            "participants",
            "transcript_segments",
            "summary",
            "action_items",
            "created_at",
            "updated_at",
        ]


class MeetingWriteSerializer(serializers.ModelSerializer):
    participants = serializers.ListField(child=serializers.CharField(max_length=120), required=False)

    class Meta:
        model = Meeting
        fields = ["title", "meeting_date", "duration_seconds", "participants"]

    def validate_title(self, value: str) -> str:
        if not value.strip():
            raise serializers.ValidationError("Meeting title is required.")
        return value.strip()

    def validate_duration_seconds(self, value: int) -> int:
        if value < 0:
            raise serializers.ValidationError("Duration must be greater than or equal to 0.")
        return value

    def validate_participants(self, value: list[str]) -> list[str]:
        cleaned: list[str] = []
        seen: set[str] = set()
        for name in value:
            participant = name.strip()
            if not participant:
                continue
            key = participant.lower()
            if key in seen:
                continue
            seen.add(key)
            cleaned.append(participant)
        if len(cleaned) > 20:
            raise serializers.ValidationError("A meeting can include at most 20 participants.")
        return cleaned

    @transaction.atomic
    def create(self, validated_data):
        participants = validated_data.pop("participants", [])
        meeting = Meeting.objects.create(**validated_data)
        self._sync_participants(meeting, participants)
        return meeting

    @transaction.atomic
    def update(self, instance, validated_data):
        participants = validated_data.pop("participants", None)
        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        if participants is not None:
            self._sync_participants(instance, participants)
        return instance

    def _sync_participants(self, meeting: Meeting, participants: list[str]) -> None:
        meeting.participants.all().delete()
        Participant.objects.bulk_create([Participant(meeting=meeting, name=name) for name in participants])
