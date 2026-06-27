from rest_framework import serializers

from .models import ActionItem


class ActionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionItem
        fields = ["id", "meeting", "description", "owner", "due_date", "completed", "created_at"]
        read_only_fields = ["id", "meeting", "created_at"]

    def validate_description(self, value: str) -> str:
        if not value.strip():
            raise serializers.ValidationError("Action description is required.")
        return value.strip()
