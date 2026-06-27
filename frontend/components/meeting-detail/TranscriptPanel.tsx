"use client";

import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useMemo, useRef } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn, formatTimestamp } from "@/lib/utils";
import type { TranscriptSegment } from "@/types";

interface TranscriptPanelProps {
  segments: TranscriptSegment[];
  currentTime: number;
  query: string;
  selectedMatch: number;
  onQueryChange: (query: string) => void;
  onSeek: (seconds: number) => void;
  onSelectMatch: (index: number) => void;
}

export function TranscriptPanel({ segments, currentTime, query, selectedMatch, onQueryChange, onSeek, onSelectMatch }: TranscriptPanelProps) {
  const rowRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const matchingSegments = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return segments.filter((segment) => segment.text.toLowerCase().includes(normalized));
  }, [query, segments]);

  const activeSegmentId = segments.find((segment) => currentTime >= segment.start_time_seconds && currentTime <= segment.end_time_seconds)?.id;

  function moveMatch(direction: 1 | -1) {
    if (!matchingSegments.length) return;
    const next = (selectedMatch + direction + matchingSegments.length) % matchingSegments.length;
    onSelectMatch(next);
    const segment = matchingSegments[next];
    onSeek(segment.start_time_seconds);
    rowRefs.current[segment.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <section className="rounded-2xl border border-line bg-white shadow-sm">
      <div className="border-b border-line p-4">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Transcript</h2>
            <p className="text-sm text-muted">{segments.length} segments</p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="secondary" size="icon" onClick={() => moveMatch(-1)} disabled={!matchingSegments.length} aria-label="Previous match">
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" onClick={() => moveMatch(1)} disabled={!matchingSegments.length} aria-label="Next match">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input className="pl-9" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search transcript" aria-label="Search transcript" />
        </label>
      </div>
      <div className="max-h-[calc(100vh-310px)] min-h-[420px] overflow-y-auto p-3">
        {segments.map((segment) => (
          <div
            key={segment.id}
            ref={(node) => {
              rowRefs.current[segment.id] = node;
            }}
            className={cn(
              "grid cursor-pointer grid-cols-[42px_1fr] gap-3 rounded-xl p-3 transition hover:bg-slate-50",
              activeSegmentId === segment.id && "bg-indigo-50 ring-1 ring-indigo-100",
            )}
            onClick={() => onSeek(segment.start_time_seconds)}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">{initials(segment.speaker)}</div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-ink">{segment.speaker}</span>
                <button
                  className="focus-ring rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-primary hover:bg-indigo-50"
                  onClick={(event) => {
                    event.stopPropagation();
                    onSeek(segment.start_time_seconds);
                  }}
                >
                  {formatTimestamp(segment.start_time_seconds)}
                </button>
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-700">{highlight(segment.text, query)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function highlight(text: string, query: string) {
  const normalized = query.trim();
  if (!normalized) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(normalized)})`, "gi"));
  return parts.map((part, index) =>
    part.toLowerCase() === normalized.toLowerCase() ? (
      <mark key={`${part}-${index}`} className="rounded bg-amber-100 px-0.5 text-amber-900">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    ),
  );
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
