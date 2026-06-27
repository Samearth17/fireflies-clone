from django.contrib import admin

from .models import Meeting, Participant


class ParticipantInline(admin.TabularInline):
    model = Participant
    extra = 0


@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    list_display = ("title", "meeting_date", "duration_seconds", "created_at")
    list_filter = ("meeting_date",)
    search_fields = ("title", "participants__name")
    inlines = [ParticipantInline]
