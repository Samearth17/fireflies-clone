from django.urls import path

from .views import (
    ActionDetailView,
    MeetingActionCollectionView,
    MeetingCollectionView,
    MeetingDetailView,
    SummaryRegenerateView,
    SummaryView,
    TranscriptSearchView,
    TranscriptView,
)

urlpatterns = [
    path("meetings", MeetingCollectionView.as_view(), name="meeting-list"),
    path("meetings/<int:meeting_id>", MeetingDetailView.as_view(), name="meeting-detail"),
    path("meetings/<int:meeting_id>/transcript", TranscriptView.as_view(), name="meeting-transcript"),
    path("meetings/<int:meeting_id>/transcript/search", TranscriptSearchView.as_view(), name="meeting-transcript-search"),
    path("meetings/<int:meeting_id>/summary", SummaryView.as_view(), name="meeting-summary"),
    path("meetings/<int:meeting_id>/summary/regenerate", SummaryRegenerateView.as_view(), name="meeting-summary-regenerate"),
    path("meetings/<int:meeting_id>/actions", MeetingActionCollectionView.as_view(), name="meeting-actions"),
    path("actions/<int:action_id>", ActionDetailView.as_view(), name="action-detail"),
]
