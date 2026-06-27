from collections import Counter

from meetings.models import Meeting
from summaries.models import Summary

STOP_WORDS = {
    "about",
    "after",
    "again",
    "also",
    "and",
    "are",
    "for",
    "from",
    "have",
    "into",
    "next",
    "our",
    "that",
    "the",
    "this",
    "with",
    "will",
}


def regenerate_summary(meeting: Meeting):
    transcript_text = " ".join(segment.transcript_text for segment in meeting.transcript_segments.all())
    words = [word.strip(".,!?;:").lower() for word in transcript_text.split()]
    topics = [word.title() for word, _count in Counter(word for word in words if len(word) > 4 and word not in STOP_WORDS).most_common(5)]
    if not topics:
        topics = ["Roadmap", "Risks", "Follow-Up"]

    overview = (
        f"{meeting.title} covered {', '.join(topics[:3]).lower()} with clear next steps for the team. "
        "The conversation balanced progress updates, blockers, decisions, and ownership."
    )
    decisions = [
        f"Prioritize {topics[0].lower()} before the next checkpoint.",
        "Keep owners accountable through action-item follow-up.",
    ]
    summary, _created = Summary.objects.update_or_create(
        meeting=meeting,
        defaults={"overview": overview, "key_topics": topics, "decisions": decisions},
    )
    return summary
