# Fireflies.ai Clone

A full-stack meeting notes and transcription workspace inspired by Fireflies.ai. The app lets a demo user browse a seeded meeting library, search and filter meetings, open transcript detail pages, seek through transcript timestamps with a placeholder media player, review AI-style summaries, and manage action items.

## Tech Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, React Query, React Hook Form, Axios, lucide-react
- Backend: Django, Django REST Framework, django-cors-headers
- Database: SQLite for local development, with a portable relational schema
- Deployment targets: Vercel/Netlify for frontend and Render/Railway-style Python hosts for backend

## Architecture

```text
Browser
  -> Next.js frontend
  -> Axios service layer at /frontend/services/api.ts
  -> Django REST API under /api
  -> SQLite via Django domain apps
```

Backend domain boundaries:

- `meetings`: meeting metadata, participants, API views, seed command
- `transcripts`: transcript segment model and text/VTT/JSON parsing
- `summaries`: one-to-one summary model and deterministic mock summary regeneration
- `actions`: action item model and serializers
- `users`: placeholder app for the single demo-user assumption

Frontend boundaries:

- `app`: Next routes and providers
- `components/meetings`: dashboard, cards, create/edit/delete flows
- `components/meeting-detail`: transcript, player, summary, action item, upload flows
- `components/ui`: local reusable controls
- `hooks`, `services`, `types`, `lib`: data fetching, API calls, shared types, utilities

## Local Setup

Backend:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver 8000
```

Frontend:

```bash
cd frontend
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The frontend expects the API at `http://localhost:8000/api` unless `NEXT_PUBLIC_API_URL` is set.

## Environment Variables

Backend:

| Name | Example | Notes |
| --- | --- | --- |
| `DJANGO_SECRET_KEY` | `replace-me` | Required in production. |
| `DJANGO_DEBUG` | `False` | Use `False` for deployed environments. |
| `DJANGO_ALLOWED_HOSTS` | `api.example.com,localhost` | Comma-separated Django hosts. |
| `CORS_ALLOWED_ORIGINS` | `https://app.example.com` | Comma-separated frontend origins. |
| `CORS_ALLOW_ALL_ORIGINS` | `False` | Keep false outside local experiments. |

Frontend:

| Name | Example | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `https://api.example.com/api` | Must include the `/api` suffix. |

## API Overview

- `GET /api/health`
- `GET /api/meetings?search=&sort=recent|oldest&date=YYYY-MM-DD`
- `POST /api/meetings`
- `GET /api/meetings/{id}`
- `PUT /api/meetings/{id}`
- `DELETE /api/meetings/{id}`
- `GET /api/meetings/{id}/transcript`
- `POST /api/meetings/{id}/transcript`
- `GET /api/meetings/{id}/transcript/search?q=term`
- `GET /api/meetings/{id}/summary`
- `POST /api/meetings/{id}/summary/regenerate`
- `GET /api/meetings/{id}/actions`
- `POST /api/meetings/{id}/actions`
- `PUT /api/actions/{id}`
- `DELETE /api/actions/{id}`

Validation errors return:

```json
{
  "error": "Validation failed",
  "details": {}
}
```

## Database Schema

- `Meeting`: title, meeting date, duration, created/updated timestamps
- `Participant`: meeting foreign key, name, optional email
- `TranscriptSegment`: meeting foreign key, speaker, start/end timestamps, transcript text
- `Summary`: one-to-one meeting foreign key, overview, key topics, decisions
- `ActionItem`: meeting foreign key, description, owner, due date, completion state, created timestamp

Deleting a meeting cascades participants, transcript segments, summary, and action items.

## Seed Data

Run:

```bash
python manage.py seed_data
```

The seed command creates 10 realistic meetings, 40-60 participants, 120-250 transcript segments, 10 summaries, and 50 action items. Authentication is intentionally omitted, so the app assumes one default logged-in demo user.

## Verification

Backend:

```bash
cd backend
python manage.py check
python manage.py test
```

Frontend:

```bash
cd frontend
pnpm typecheck
pnpm build
```

Manual smoke checks:

- Start Django and Next.js.
- Confirm the dashboard loads seeded meetings.
- Search by title and participant.
- Create, edit, and delete a meeting.
- Open a meeting, click transcript timestamps, move the media seek bar, and search transcript text.
- Upload or paste a transcript and regenerate the summary.
- Add, edit, complete, and delete action items.
- Check desktop and mobile layouts.

## Deployment

Backend deployment:

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
gunicorn config.wsgi:application
```

Set `DJANGO_DEBUG=False`, a strong `DJANGO_SECRET_KEY`, production `DJANGO_ALLOWED_HOSTS`, and `CORS_ALLOWED_ORIGINS` containing the deployed frontend URL. A `backend/Procfile` is included for hosts that detect Procfile web commands.

Frontend deployment:

```bash
cd frontend
pnpm install
pnpm build
pnpm start
```

Set `NEXT_PUBLIC_API_URL` to the deployed Django base URL ending in `/api`. Vercel can use the `frontend/` directory as the project root.

Submission placeholders:

- GitHub repository: add public repository URL here.
- Deployed application: add hosted frontend URL here.
- Deployed API: add hosted backend URL here.

## Assumptions

- Real-time meeting bots, actual speech-to-text transcription, integrations, team sharing, and real authentication are out of scope.
- AI summaries are deterministic mock summaries generated from transcript text.
- Uploaded transcript content can be plain text, VTT-style text, or JSON segments accepted by the backend parser.
