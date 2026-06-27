from django.core.exceptions import ValidationError
from django.db import models


class Meeting(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    meeting_date = models.DateTimeField(db_index=True)
    duration_seconds = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-meeting_date"]
        indexes = [
            models.Index(fields=["title"]),
            models.Index(fields=["meeting_date"]),
        ]

    def __str__(self) -> str:
        return self.title

    def clean(self) -> None:
        if not self.title.strip():
            raise ValidationError({"title": "Title is required."})
        if self.duration_seconds < 0:
            raise ValidationError({"duration_seconds": "Duration must be greater than or equal to 0."})


class Participant(models.Model):
    meeting = models.ForeignKey(Meeting, related_name="participants", on_delete=models.CASCADE)
    name = models.CharField(max_length=120)
    email = models.EmailField(blank=True, null=True)

    class Meta:
        ordering = ["name"]
        indexes = [models.Index(fields=["meeting"])]

    def __str__(self) -> str:
        return self.name
