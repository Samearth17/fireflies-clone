from django.core.exceptions import ValidationError
from django.db import models


class TranscriptSegment(models.Model):
    meeting = models.ForeignKey("meetings.Meeting", related_name="transcript_segments", on_delete=models.CASCADE)
    speaker_name = models.CharField(max_length=120)
    start_time_seconds = models.PositiveIntegerField()
    end_time_seconds = models.PositiveIntegerField()
    transcript_text = models.TextField()

    class Meta:
        ordering = ["start_time_seconds"]
        indexes = [
            models.Index(fields=["meeting"]),
            models.Index(fields=["speaker_name"]),
            models.Index(fields=["start_time_seconds"]),
        ]

    def __str__(self) -> str:
        return f"{self.speaker_name} @ {self.start_time_seconds}s"

    def clean(self) -> None:
        if not self.speaker_name.strip():
            raise ValidationError({"speaker_name": "Speaker is required."})
        if self.end_time_seconds < self.start_time_seconds:
            raise ValidationError({"end_time_seconds": "End time must be after start time."})
        if not self.transcript_text.strip():
            raise ValidationError({"transcript_text": "Transcript text is required."})
