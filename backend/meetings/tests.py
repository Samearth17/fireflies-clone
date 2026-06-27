from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from actions.models import ActionItem
from summaries.models import Summary
from transcripts.models import TranscriptSegment

from .models import Meeting, Participant


class MeetingApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.meeting = Meeting.objects.create(title="Sprint Planning", meeting_date=timezone.now(), duration_seconds=1800)
        Participant.objects.create(meeting=self.meeting, name="Alice")
        Participant.objects.create(meeting=self.meeting, name="Bob")
        TranscriptSegment.objects.create(
            meeting=self.meeting,
            speaker_name="Alice",
            start_time_seconds=0,
            end_time_seconds=12,
            transcript_text="We need to prioritize the onboarding flow.",
        )
        Summary.objects.create(
            meeting=self.meeting,
            overview="Planning focused on onboarding.",
            key_topics=["Onboarding"],
            decisions=["Improve activation."],
        )
        ActionItem.objects.create(meeting=self.meeting, description="Draft onboarding metrics", owner="Bob")

    def test_meeting_list_searches_participants(self):
        response = self.client.get("/api/meetings", {"search": "Alice"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

    def test_transcript_search_returns_matching_segment(self):
        response = self.client.get(f"/api/meetings/{self.meeting.id}/transcript/search", {"q": "onboarding"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]["speaker"], "Alice")

    def test_upload_pasted_transcript_with_close_timestamps(self):
        response = self.client.post(
            f"/api/meetings/{self.meeting.id}/transcript",
            {
                "text": "\n".join(
                    [
                        "[00:00] Alice: We should verify create update and delete.",
                        "[00:12] Bob: I will own the follow up.",
                    ]
                )
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["end_time_seconds"], 12)
        self.assertEqual(response.data[1]["start_time_seconds"], 12)

    def test_create_meeting_rolls_back_when_transcript_is_invalid(self):
        response = self.client.post(
            "/api/meetings",
            {
                "title": "Invalid Transcript",
                "meeting_date": "2026-06-28T10:00:00Z",
                "duration_seconds": 900,
                "participants": ["Alice", "Bob"],
                "segments": [
                    {"speaker": "Alice", "start": 30, "end": 40, "text": "This starts later."},
                    {"speaker": "Bob", "start": 10, "end": 20, "text": "This moves backward."},
                ],
            },
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        self.assertFalse(Meeting.objects.filter(title="Invalid Transcript").exists())

    def test_create_action_item(self):
        response = self.client.post(
            f"/api/meetings/{self.meeting.id}/actions",
            {"description": "Send launch notes", "owner": "Alice", "due_date": "2026-07-05"},
            format="json",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ActionItem.objects.count(), 2)

    def test_delete_meeting_cascades_dependents(self):
        response = self.client.delete(f"/api/meetings/{self.meeting.id}")
        self.assertEqual(response.status_code, 204)
        self.assertEqual(TranscriptSegment.objects.count(), 0)
        self.assertEqual(ActionItem.objects.count(), 0)
