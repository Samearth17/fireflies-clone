from django.contrib import admin

from .models import TranscriptSegment


@admin.register(TranscriptSegment)
class TranscriptSegmentAdmin(admin.ModelAdmin):
    list_display = ("meeting", "speaker_name", "start_time_seconds", "end_time_seconds")
    list_filter = ("speaker_name",)
    search_fields = ("meeting__title", "speaker_name", "transcript_text")
