from django.db import models


class Summary(models.Model):
    meeting = models.OneToOneField("meetings.Meeting", related_name="summary", on_delete=models.CASCADE)
    overview = models.TextField()
    key_topics = models.JSONField(default=list)
    decisions = models.JSONField(default=list)

    class Meta:
        verbose_name_plural = "summaries"

    def __str__(self) -> str:
        return f"Summary for {self.meeting.title}"
