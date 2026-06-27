# PROJECT_SPEC.md

# Fireflies.ai Clone --- Master Project Specification

## 1. Objective

Build a production-quality clone of Fireflies.ai that fulfills every
requirement in the assignment while emphasizing clean architecture,
maintainability, and a modern user experience.

## 2. Technology Stack

### Frontend

-   Next.js (App Router)
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   React Query
-   React Hook Form
-   Axios

### Backend

-   Django
-   Django REST Framework
-   SQLite

## 3. Goals

-   Fireflies-inspired UI
-   Interactive transcript experience
-   Meeting CRUD
-   AI summary section
-   Action items
-   Persistent storage
-   Responsive design

## 4. Functional Requirements

### Dashboard

-   Meeting cards
-   Search
-   Filter
-   Sort
-   Profile menu placeholder

### Meeting Detail

-   Transcript
-   Timestamp navigation
-   Speaker labels
-   Search highlighting
-   Summary panel
-   Action items
-   Placeholder media player

### CRUD

-   Create meeting
-   Edit metadata
-   Delete meeting
-   Manage action items

## 5. Non-functional Requirements

-   Mobile responsive
-   Modular architecture
-   RESTful API
-   Reusable components
-   Fast loading
-   Accessible UI

## 6. Proposed Folder Structure

``` text
frontend/
  app/
  components/
  hooks/
  lib/
  services/
  types/

backend/
  config/
  meetings/
  transcripts/
  summaries/
  actions/
  users/
  management/
```

## 7. Feature Breakdown

### Dashboard

Displays all meetings with: - title - date - duration - participants -
search - filters

### Meeting Page

Contains: - Transcript viewer - Summary panel - Action items - Media
player - Transcript search

## 8. Data Flow

Browser → Next.js → Django REST API → SQLite

## 9. State Management

-   React Query for server state
-   Local state for UI
-   Optimistic updates where appropriate

## 10. Security Assumptions

-   Single demo user
-   No authentication required
-   CSRF enabled for Django admin
-   Input validation on all APIs

## 11. Seed Data

Create: - 10 meetings - realistic participants - long transcripts -
summaries - action items

## 12. UI Guidelines

-   Fireflies-inspired layout
-   Rounded cards
-   Soft shadows
-   Neutral palette
-   Responsive
-   Toast notifications
-   Skeleton loaders

## 13. Deliverables

-   Public GitHub repository
-   Working deployment
-   README
-   Seed script
-   API documentation

## 14. Milestones

1.  Scaffold project
2.  Backend models
3.  CRUD APIs
4.  Dashboard
5.  Meeting page
6.  Transcript
7.  Summary
8.  Action items
9.  Seed data
10. Polish

## 15. Acceptance Checklist

-   Dashboard complete
-   Transcript interactive
-   Search implemented
-   CRUD complete
-   Fireflies-inspired UI
-   Responsive
-   README included
-   Deployable

## References

Additional companion documents: - DB_SCHEMA.md - API_SPEC.md -
UI_GUIDE.md - CODE_STANDARDS.md
