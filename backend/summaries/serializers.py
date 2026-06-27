from rest_framework import serializers

from .models import Summary


class SummarySerializer(serializers.ModelSerializer):
    action_items = serializers.SerializerMethodField()

    class Meta:
        model = Summary
        fields = ["id", "overview", "key_topics", "decisions", "action_items"]

    def get_action_items(self, obj: Summary) -> int:
        return obj.meeting.action_items.count()
