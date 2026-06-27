# DB_SCHEMA.md

# Fireflies.ai Clone --- Database Design Specification

## Database

Engine: SQLite (development), schema designed to be portable to
PostgreSQL.

## Design Principles

-   Third Normal Form (3NF)
-   UUID-ready integer primary keys
-   Foreign key integrity
-   Cascading deletes for dependent entities
-   Indexed search fields

------------------------------------------------------------------------

# Entity Relationship Overview

Meeting ├── Participants (1:N) ├── Transcript Segments (1:N) ├── Action
Items (1:N) └── Summary (1:1)

------------------------------------------------------------------------

# Table: Meeting

  Field              Type           Notes
  ------------------ -------------- ----------------
  id                 Integer PK     Auto increment
  title              VARCHAR(255)   Required
  meeting_date       DATETIME       Required
  duration_seconds   Integer        Required
  created_at         DATETIME       Auto
  updated_at         DATETIME       Auto

Indexes: - meeting_date - title

------------------------------------------------------------------------

# Table: Participant

  Field        Type
  ------------ -------------------
  id           Integer PK
  meeting_id   FK
  name         VARCHAR(120)
  email        VARCHAR(255) NULL

Relationship: Meeting → Participants (One-to-Many)

------------------------------------------------------------------------

# Table: TranscriptSegment

  Field                Type
  -------------------- --------------
  id                   Integer PK
  meeting_id           FK
  speaker_name         VARCHAR(120)
  start_time_seconds   Integer
  end_time_seconds     Integer
  transcript_text      TEXT

Indexes: - meeting_id - speaker_name - start_time_seconds

Requirements: - Preserve chronological order - Clicking transcript seeks
player - Search must operate over transcript_text

------------------------------------------------------------------------

# Table: Summary

  Field        Type
  ------------ -------------
  id           Integer PK
  meeting_id   OneToOne FK
  overview     TEXT
  key_topics   JSON/Text
  decisions    TEXT

Exactly one summary per meeting.

------------------------------------------------------------------------

# Table: ActionItem

  Field         Type
  ------------- -------------------
  id            Integer PK
  meeting_id    FK
  description   TEXT
  owner         VARCHAR(120) NULL
  due_date      DATE NULL
  completed     BOOLEAN
  created_at    DATETIME

Indexes: - completed - due_date

------------------------------------------------------------------------

# Suggested Django Models

apps: - meetings - transcripts - summaries - actions

Models: - Meeting - Participant - TranscriptSegment - Summary -
ActionItem

------------------------------------------------------------------------

# Constraints

-   Delete meeting → cascade participants, transcript, summary and
    action items.
-   Empty transcript not allowed.
-   Title required.
-   Duration must be \>= 0.
-   Transcript timestamps must be increasing.

------------------------------------------------------------------------

# Seed Data

Generate: - 10 meetings - 40--60 participants total - 120--250
transcript segments - 50 action items - 10 summaries

Use Django management command:

python manage.py seed_data

------------------------------------------------------------------------

# Performance

Recommended indexes: - meeting.title - meeting.meeting_date -
transcript.meeting_id - transcript.start_time_seconds -
participant.meeting_id - actionitem.completed

------------------------------------------------------------------------

# Future Extensions

Reserved for: - Comments - Highlights - Tags - Attachments - Chat with
meeting - Organizations - Users - Authentication

This schema should remain backward compatible with PostgreSQL.
