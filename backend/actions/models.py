from django.db import models


class ActionItem(models.Model):
    meeting = models.ForeignKey("meetings.Meeting", related_name="action_items", on_delete=models.CASCADE)
    description = models.TextField()
    owner = models.CharField(max_length=120, blank=True, null=True)
    due_date = models.DateField(blank=True, null=True)
    completed = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["completed", "due_date", "created_at"]
        indexes = [
            models.Index(fields=["completed"]),
            models.Index(fields=["due_date"]),
        ]

    def __str__(self) -> str:
        return self.description[:80]
