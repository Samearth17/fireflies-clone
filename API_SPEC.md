# API_SPEC.md

# Fireflies.ai Clone --- REST API Specification

## Base URL

`/api`

## Conventions

-   JSON requests/responses
-   UTF-8
-   HTTP status codes
-   Validation errors return:

``` json
{
  "error": "Validation failed",
  "details": {}
}
```

------------------------------------------------------------------------

# Meetings

## GET /api/meetings

Returns all meetings.

Query Parameters

  Name     Description
  -------- --------------------------------
  search   Search by title or participant
  sort     recent, oldest
  date     Filter by date

Response

``` json
[
 {
   "id":1,
   "title":"Sprint Planning",
   "duration_seconds":3600,
   "meeting_date":"2026-06-01T09:00:00Z",
   "participants":["Alice","Bob"]
 }
]
```

Status - 200 OK

------------------------------------------------------------------------

## GET /api/meetings/{id}

Returns one meeting with metadata.

404 if missing.

------------------------------------------------------------------------

## POST /api/meetings

Creates a meeting.

Request

``` json
{
 "title":"Weekly Sync",
 "meeting_date":"2026-06-28T10:00:00",
 "duration_seconds":1800,
 "participants":["Alice","Bob"]
}
```

Response: 201 Created

------------------------------------------------------------------------

## PUT /api/meetings/{id}

Updates title, date, duration and participants.

Response: 200 OK

------------------------------------------------------------------------

## DELETE /api/meetings/{id}

Deletes meeting and cascades transcript, summary and action items.

Response: 204 No Content

------------------------------------------------------------------------

# Transcript

## GET /api/meetings/{id}/transcript

Returns ordered transcript segments.

``` json
[
 {
   "speaker":"Alice",
   "start_time_seconds":12,
   "end_time_seconds":19,
   "text":"Welcome everyone."
 }
]
```

------------------------------------------------------------------------

## POST /api/meetings/{id}/transcript

Accept transcript upload or pasted transcript.

Supports: - text - json - vtt (optional)

------------------------------------------------------------------------

## GET /api/meetings/{id}/transcript/search?q=design

Returns matching transcript segments with timestamps.

------------------------------------------------------------------------

# Summary

## GET /api/meetings/{id}/summary

``` json
{
 "overview":"Meeting discussed roadmap.",
 "key_topics":["Hiring","Roadmap"],
 "decisions":["Ship v2"],
 "action_items":5
}
```

------------------------------------------------------------------------

## POST /api/meetings/{id}/summary/regenerate

Creates or refreshes a mocked/LLM-generated summary.

------------------------------------------------------------------------

# Action Items

## GET /api/meetings/{id}/actions

Returns all tasks.

------------------------------------------------------------------------

## POST /api/meetings/{id}/actions

``` json
{
 "description":"Prepare presentation",
 "owner":"Alice",
 "due_date":"2026-07-05"
}
```

------------------------------------------------------------------------

## PUT /api/actions/{id}

Update: - description - owner - due_date - completed

------------------------------------------------------------------------

## DELETE /api/actions/{id}

Deletes task.

------------------------------------------------------------------------

# Health

## GET /api/health

``` json
{
 "status":"ok"
}
```

------------------------------------------------------------------------

# Validation Rules

-   Meeting title required
-   Duration \>= 0
-   Transcript segments require speaker and timestamp
-   Action description required
-   Search queries trimmed

------------------------------------------------------------------------

# Error Codes

  Code   Meaning
  ------ --------------
  200    Success
  201    Created
  204    Deleted
  400    Bad Request
  404    Not Found
  500    Server Error

------------------------------------------------------------------------

# Future APIs

-   Global search
-   Comments
-   Highlights
-   Export PDF
-   Ask AI about meeting
-   Tags
-   Authentication
