from rest_framework import serializers

from .models import TranscriptSegment


class TranscriptSegmentSerializer(serializers.ModelSerializer):
    speaker = serializers.CharField(source="speaker_name")
    text = serializers.CharField(source="transcript_text")

    class Meta:
        model = TranscriptSegment
        fields = ["id", "speaker", "start_time_seconds", "end_time_seconds", "text"]
