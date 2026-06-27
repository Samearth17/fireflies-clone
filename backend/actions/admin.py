from django.contrib import admin

from .models import ActionItem


@admin.register(ActionItem)
class ActionItemAdmin(admin.ModelAdmin):
    list_display = ("description", "meeting", "owner", "due_date", "completed")
    list_filter = ("completed", "due_date")
    search_fields = ("description", "owner", "meeting__title")
