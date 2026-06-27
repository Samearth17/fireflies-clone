# CODE_STANDARDS.md

# Fireflies.ai Clone --- Coding Standards & Engineering Guidelines

## Purpose

These standards define how the project should be implemented to ensure
consistency, maintainability, readability, and interview-quality code.

------------------------------------------------------------------------

# 1. General Principles

-   Follow SOLID principles.
-   Prefer composition over inheritance.
-   Keep functions small and focused.
-   Avoid duplicated logic (DRY).
-   Use meaningful names.
-   Do not leave TODOs or dead code.

------------------------------------------------------------------------

# 2. Project Structure

Frontend - Feature-oriented components. - Shared UI components in
`components/ui`. - API calls isolated in `services`. - Types in
`types`. - Hooks in `hooks`.

Backend - One Django app per domain. - Keep business logic in services
where appropriate. - Thin views, fat models/services. - Separate
serializers from views.

------------------------------------------------------------------------

# 3. Naming Conventions

## Files

-   kebab-case for utility files
-   PascalCase for React components

Examples: - meeting-card.tsx - TranscriptPanel.tsx

## Variables

camelCase

## Classes

PascalCase

## Constants

UPPER_SNAKE_CASE

------------------------------------------------------------------------

# 4. React Standards

-   Functional components only.
-   TypeScript everywhere.
-   Define interfaces for props.
-   Avoid prop drilling where possible.
-   Use React Query for server state.
-   Use React Hook Form for forms.

------------------------------------------------------------------------

# 5. Django Standards

-   Django REST Framework.
-   ModelSerializer where appropriate.
-   Validate input in serializers.
-   Use proper HTTP status codes.
-   Keep migrations clean.
-   Use management commands for seed data.

------------------------------------------------------------------------

# 6. API Design

-   RESTful endpoints.
-   JSON only.
-   Consistent error responses.
-   Pagination-ready design.
-   Validate all user input.

------------------------------------------------------------------------

# 7. Error Handling

Frontend - Friendly error messages. - Retry options where appropriate. -
Loading and empty states.

Backend - Return structured JSON errors. - Log unexpected exceptions. -
Never expose stack traces to clients.

------------------------------------------------------------------------

# 8. Logging

Use Django logging.

Log: - Server errors - Validation failures - Startup events

Avoid logging sensitive data.

------------------------------------------------------------------------

# 9. Styling

-   Tailwind CSS only.
-   Reusable utility classes.
-   Consistent spacing scale.
-   Accessible color contrast.
-   Minimal custom CSS.

------------------------------------------------------------------------

# 10. Performance

-   Lazy load large pages.
-   Avoid unnecessary renders.
-   Memoize expensive computations.
-   Index searchable database fields.
-   Keep API payloads concise.

------------------------------------------------------------------------

# 11. Accessibility

-   Semantic HTML.
-   Keyboard navigation.
-   ARIA labels where needed.
-   Visible focus indicators.
-   Alt text for images.

------------------------------------------------------------------------

# 12. Git Workflow

Commit after each meaningful milestone.

Examples: - feat: implement meeting dashboard - feat: add transcript
viewer - feat: build action item CRUD - fix: transcript timestamp sync -
docs: update README

Keep commits focused.

------------------------------------------------------------------------

# 13. Testing

Backend - Unit tests for models and APIs.

Frontend - Component rendering checks. - Basic interaction tests.

Manually verify: - CRUD - Search - Transcript navigation - Responsive
layout

------------------------------------------------------------------------

# 14. Documentation

README should include: - Project overview - Setup - Folder structure -
API overview - Database schema - Deployment instructions - Assumptions

------------------------------------------------------------------------

# 15. Definition of Done

A feature is complete only if: - Code builds successfully. - No
console/server errors. - UI matches specification. - API behaves as
documented. - Responsive on desktop and mobile. - Code is formatted and
readable. - Documentation updated where applicable.

------------------------------------------------------------------------

# Final Guidance for Codex

Before stopping: 1. Compare implementation against PROJECT_SPEC.md. 2.
Verify database matches DB_SCHEMA.md. 3. Verify APIs match API_SPEC.md.
4. Verify UI follows UI_GUIDE.md. 5. Resolve build errors. 6. Ensure the
application is deployable.
