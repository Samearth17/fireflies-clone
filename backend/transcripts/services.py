import json
import re
from typing import Any


TIMESTAMP_PATTERN = re.compile(r"(?:(\d{1,2}):)?(\d{1,2}):(\d{2})(?:[.,]\d{1,3})?")
SPEAKER_LINE_PATTERN = re.compile(r"^\s*(?:\[(?P<stamp>[^\]]+)\]\s*)?(?P<speaker>[A-Za-z][\w .'-]{1,40}):\s*(?P<text>.+)$")


def parse_timestamp(value: str | int | float | None, fallback: int = 0) -> int:
    if value is None:
        return fallback
    if isinstance(value, (int, float)):
        return max(0, int(value))
    value = value.strip()
    if value.isdigit():
        return int(value)
    match = TIMESTAMP_PATTERN.search(value)
    if not match:
        return fallback
    hours = int(match.group(1) or 0)
    minutes = int(match.group(2))
    seconds = int(match.group(3))
    return hours * 3600 + minutes * 60 + seconds


def parse_transcript_payload(payload: dict[str, Any]) -> list[dict[str, Any]]:
    raw_segments = payload.get("segments")
    if raw_segments:
        if isinstance(raw_segments, str):
            raw_segments = json.loads(raw_segments)
        return [_normalize_segment(segment, index) for index, segment in enumerate(raw_segments)]

    text = payload.get("text") or payload.get("transcript") or payload.get("vtt") or ""
    text = text.strip()
    if not text:
        return []

    if "WEBVTT" in text[:20] or "-->" in text:
        return _parse_vtt(text)
    return _parse_plain_text(text)


def _normalize_segment(segment: dict[str, Any], index: int) -> dict[str, Any]:
    start = parse_timestamp(segment.get("start_time_seconds") or segment.get("start") or segment.get("timestamp"), index * 30)
    end = parse_timestamp(segment.get("end_time_seconds") or segment.get("end"), start + 20)
    text = str(segment.get("text") or segment.get("transcript_text") or "").strip()
    speaker = str(segment.get("speaker") or segment.get("speaker_name") or "Speaker").strip()
    return {
        "speaker_name": speaker,
        "start_time_seconds": start,
        "end_time_seconds": max(end, start),
        "transcript_text": text,
    }


def _parse_plain_text(text: str) -> list[dict[str, Any]]:
    segments: list[dict[str, Any]] = []
    current_time = 0
    for line in [line.strip() for line in text.splitlines() if line.strip()]:
        match = SPEAKER_LINE_PATTERN.match(line)
        if match:
            start = parse_timestamp(match.group("stamp"), current_time)
            speaker = match.group("speaker").strip()
            segment_text = match.group("text").strip()
        else:
            start = current_time
            speaker = "Speaker"
            segment_text = line
        duration = max(10, min(45, len(segment_text.split()) * 3))
        segments.append(
            {
                "speaker_name": speaker,
                "start_time_seconds": start,
                "end_time_seconds": start + duration,
                "transcript_text": segment_text,
            }
        )
        current_time = start + duration
    for index, segment in enumerate(segments[:-1]):
        next_start = segments[index + 1]["start_time_seconds"]
        if segment["end_time_seconds"] > next_start:
            segment["end_time_seconds"] = max(segment["start_time_seconds"], next_start)
    return segments


def _parse_vtt(text: str) -> list[dict[str, Any]]:
    blocks = re.split(r"\n\s*\n", text.replace("\r\n", "\n"))
    segments: list[dict[str, Any]] = []
    for block in blocks:
        lines = [line.strip() for line in block.splitlines() if line.strip() and line.strip() != "WEBVTT"]
        if not lines:
            continue
        timing_index = next((idx for idx, line in enumerate(lines) if "-->" in line), None)
        if timing_index is None:
            continue
        start_raw, end_raw = [part.strip() for part in lines[timing_index].split("-->", 1)]
        caption = " ".join(lines[timing_index + 1 :]).strip()
        speaker = "Speaker"
        speaker_match = SPEAKER_LINE_PATTERN.match(caption)
        if speaker_match:
            speaker = speaker_match.group("speaker").strip()
            caption = speaker_match.group("text").strip()
        segments.append(
            {
                "speaker_name": speaker,
                "start_time_seconds": parse_timestamp(start_raw),
                "end_time_seconds": parse_timestamp(end_raw),
                "transcript_text": caption,
            }
        )
    return segments
