# PROJECT_SPEC.md

# Fireflies.ai Clone -- Full Technical Specification

## Objective

Build a production-quality clone of Fireflies.ai that satisfies every
requirement in the assignment.

## Tech Stack

### Frontend

-   Next.js (latest App Router)
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   React Query
-   React Hook Form
-   Axios
-   Framer Motion

### Backend

-   Django
-   Django REST Framework
-   SQLite

## Folder Structure

``` text
frontend/
  app/
  components/
  hooks/
  services/
  types/
  lib/

backend/
  config/
  meetings/
  transcripts/
  summaries/
  actions/
  users/
  seed/
```

## Database Schema

### Meeting

-   id
-   title
-   meeting_date
-   duration
-   created_at
-   updated_at

### Participant

-   id
-   meeting (FK)
-   name
-   email

### TranscriptSegment

-   id
-   meeting (FK)
-   speaker
-   timestamp_seconds
-   content

### Summary

-   id
-   meeting (OneToOne)
-   overview

### ActionItem

-   id
-   meeting (FK)
-   description
-   completed

## REST APIs

### Meetings

GET /api/meetings POST /api/meetings GET /api/meetings/{id} PUT
/api/meetings/{id} DELETE /api/meetings/{id}

### Transcript

GET /api/meetings/{id}/transcript

### Summary

GET /api/meetings/{id}/summary

### Action Items

GET /api/meetings/{id}/actions POST /api/meetings/{id}/actions PUT
/api/actions/{id} DELETE /api/actions/{id}

## Frontend Pages

### Dashboard

-   Fireflies-style sidebar
-   Search
-   Filters
-   Recent meetings
-   Profile placeholder

### Meeting Detail

-   Transcript panel
-   Summary panel
-   Action items
-   Placeholder media player
-   Click transcript timestamp -\> seek media
-   Transcript search with highlighting

## UI Requirements

Match Fireflies.ai as closely as possible: - Rounded cards - Light
theme - Modern typography - Left navigation - Responsive layout - Toast
notifications - Skeleton loaders - Empty states

## Seed Data

Generate: - 10 realistic meetings - 5--8 participants - Long
transcripts - AI summaries - 5 action items per meeting

## README

Include: - Setup - Architecture - Folder structure - API documentation -
Database schema - Deployment

## Deployment

Frontend: Vercel Backend: Render Database: SQLite

## Milestones

1.  Project setup
2.  Backend models
3.  CRUD APIs
4.  Dashboard UI
5.  Transcript page
6.  AI summary
7.  Search/filter
8.  Seed data
9.  Polish UI
10. Testing

## Acceptance Checklist

-   All assignment features implemented.
-   Clean modular architecture.
-   Responsive.
-   No TODOs.
-   Builds without errors.
-   Public GitHub ready.
