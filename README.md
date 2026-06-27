# Fireflies.ai Clone

A full-stack meeting notes and transcription workspace inspired by Fireflies.ai. The app includes a searchable meetings library, interactive transcript playback, AI-style summaries, action item management, persistent SQLite storage, and realistic seeded demo data.

## Tech Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, shadcn-style local UI components, React Query, React Hook Form, Axios
- Backend: Django, Django REST Framework, SQLite
- Database: SQLite for local development, schema designed to be portable to PostgreSQL

## Project Structure

```text
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
```

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

## Database Schema

- `Meeting`: title, meeting date, duration, timestamps
- `Participant`: meeting FK, name, optional email
- `TranscriptSegment`: meeting FK, speaker, start/end timestamps, transcript text
- `Summary`: one-to-one meeting FK, overview, key topics, decisions
- `ActionItem`: meeting FK, description, owner, due date, completion state

Deleting a meeting cascades participants, transcript segments, summary, and action items.

## Seed Data

Run:

```bash
python manage.py seed_data
```

The seed command creates 10 realistic meetings, 40-60 participants, 120-250 transcript segments, 10 summaries, and 50 action items.

## Deployment

Backend can deploy to Render, Railway, or similar Python hosts. Set `DEBUG=False`, provide a production `SECRET_KEY`, and run migrations before startup.

Frontend can deploy to Vercel or Netlify. Set `NEXT_PUBLIC_API_URL` to the deployed Django API base URL ending in `/api`.

## Assumptions

- Authentication is intentionally omitted; the app assumes one demo user.
- Real speech-to-text, live meeting bots, integrations, and team sharing are placeholders.
- Summary regeneration is deterministic and mocked from transcript text.
