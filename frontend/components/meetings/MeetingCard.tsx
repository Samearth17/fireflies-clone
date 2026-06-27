"use client";

import { Calendar, Clock3, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { formatDuration } from "@/lib/utils";
import type { MeetingListItem } from "@/types";

import { AvatarGroup } from "./AvatarGroup";

interface MeetingCardProps {
  meeting: MeetingListItem;
  onEdit: (meeting: MeetingListItem) => void;
  onDelete: (meeting: MeetingListItem) => void;
}

export function MeetingCard({ meeting, onEdit, onDelete }: MeetingCardProps) {
  return (
    <article className="group relative rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <Link href={`/meetings/${meeting.id}`} className="absolute inset-0 rounded-2xl focus-ring" aria-label={`Open ${meeting.title}`} />
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="line-clamp-2 text-base font-semibold text-ink">{meeting.title}</h2>
          <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(meeting.meeting_date).toLocaleDateString()}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-4 w-4" />
              {formatDuration(meeting.duration_seconds)}
            </span>
          </div>
        </div>
        <div className="relative flex">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Edit meeting"
            title="Edit"
            onClick={(event) => {
              event.preventDefault();
              onEdit(meeting);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Delete meeting"
            title="Delete"
            onClick={(event) => {
              event.preventDefault();
              onDelete(meeting);
            }}
          >
            <Trash2 className="h-4 w-4 text-danger" />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="More meeting actions" title="More">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 min-h-[4rem] text-sm leading-6 text-slate-600">{meeting.summary_preview || "Summary will appear when a transcript is added."}</p>
      <div className="mt-5 flex items-center justify-between">
        <AvatarGroup names={meeting.participants} />
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-warning">{meeting.action_count} actions</span>
      </div>
    </article>
  );
}
