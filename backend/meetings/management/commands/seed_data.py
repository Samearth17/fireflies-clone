from datetime import timedelta
from random import Random

from django.core.management.base import BaseCommand
from django.utils import timezone

from actions.models import ActionItem
from meetings.models import Meeting, Participant
from summaries.models import Summary
from transcripts.models import TranscriptSegment


class Command(BaseCommand):
    help = "Seed the Fireflies clone with realistic demo meetings."

    def handle(self, *args, **options):
        rng = Random(42)
        ActionItem.objects.all().delete()
        TranscriptSegment.objects.all().delete()
        Summary.objects.all().delete()
        Participant.objects.all().delete()
        Meeting.objects.all().delete()

        participant_pool = [
            "Aisha Mehta",
            "Jordan Lee",
            "Maya Chen",
            "Diego Rivera",
            "Priya Nair",
            "Noah Williams",
            "Elena Rossi",
            "Marcus Brown",
            "Fatima Khan",
            "Oliver Smith",
            "Sara Ahmed",
            "Kenji Tanaka",
        ]
        meeting_specs = [
            ("Product Roadmap Review", ["Roadmap", "Activation", "Beta"], "Finalize the Q3 roadmap around onboarding and activation."),
            ("Customer Success Escalations", ["Churn", "SLAs", "Playbooks"], "Reviewed priority accounts and support playbook updates."),
            ("Design Critique", ["Dashboard", "Transcripts", "Accessibility"], "Aligned on dashboard polish and transcript readability."),
            ("Engineering Sprint Planning", ["API", "Performance", "QA"], "Scoped backend and frontend work for the next sprint."),
            ("Launch Readiness", ["Launch", "Analytics", "Docs"], "Confirmed launch blockers, metrics, and ownership."),
            ("Sales Pipeline Sync", ["Pipeline", "Enterprise", "Demos"], "Discussed enterprise opportunities and demo follow-ups."),
            ("User Research Synthesis", ["Research", "Personas", "Insights"], "Synthesized interviews into product opportunities."),
            ("Executive Weekly", ["Revenue", "Hiring", "Risks"], "Covered business updates, hiring plans, and risk mitigation."),
            ("Integration Planning", ["Zoom", "Calendar", "CRM"], "Planned integration milestones and placeholder UX."),
            ("Retention Experiment Review", ["Retention", "Email", "Metrics"], "Evaluated retention experiments and next tests."),
        ]

        total_actions = 0
        for index, (title, topics, overview) in enumerate(meeting_specs):
            meeting = Meeting.objects.create(
                title=title,
                meeting_date=timezone.now() - timedelta(days=index * 3, hours=index),
                duration_seconds=rng.randint(32, 58) * 60,
            )
            people = rng.sample(participant_pool, rng.randint(4, 6))
            for person in people:
                Participant.objects.create(meeting=meeting, name=person, email=f"{person.lower().replace(' ', '.')}@example.com")

            current_time = 0
            for segment_index in range(rng.randint(16, 23)):
                speaker = people[segment_index % len(people)]
                topic = topics[segment_index % len(topics)]
                text = self._segment_text(segment_index, topic, people[(segment_index + 1) % len(people)])
                duration = rng.randint(14, 34)
                TranscriptSegment.objects.create(
                    meeting=meeting,
                    speaker_name=speaker,
                    start_time_seconds=current_time,
                    end_time_seconds=current_time + duration,
                    transcript_text=text,
                )
                current_time += duration + rng.randint(2, 7)

            Summary.objects.create(
                meeting=meeting,
                overview=overview,
                key_topics=topics,
                decisions=[
                    f"Keep {topics[0].lower()} as the primary focus for this cycle.",
                    f"Review {topics[-1].lower()} progress in the next meeting.",
                ],
            )

            for action_index in range(5):
                owner = people[action_index % len(people)]
                ActionItem.objects.create(
                    meeting=meeting,
                    description=f"{owner.split()[0]} to prepare the {topics[action_index % len(topics)].lower()} follow-up before the next sync.",
                    owner=owner,
                    due_date=(timezone.now() + timedelta(days=action_index + index + 2)).date(),
                    completed=(action_index == 4 and index % 2 == 0),
                )
                total_actions += 1

        self.stdout.write(self.style.SUCCESS(f"Seeded 10 meetings, {Participant.objects.count()} participants, {TranscriptSegment.objects.count()} transcript segments, {total_actions} action items."))

    def _segment_text(self, index: int, topic: str, next_owner: str) -> str:
        templates = [
            "I want to anchor this around {topic}; the main question is what customers need to see first.",
            "The data points to {topic} being the highest leverage area, especially for new teams evaluating us.",
            "Can we make sure {owner} has the context to move this forward without waiting for another review?",
            "One risk is that {topic} expands in scope, so we should define the smallest useful version today.",
            "That sounds right. The follow-up should include owners, dates, and a quick success metric.",
            "From the customer calls, the clearest signal was that {topic} needs to feel simple and trustworthy.",
        ]
        return templates[index % len(templates)].format(topic=topic.lower(), owner=next_owner.split()[0])
