"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, FileUp, Pencil } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { MeetingFormModal } from "@/components/meetings/MeetingFormModal";
import { cn } from "@/lib/utils";
import { createAction, deleteAction, getMeeting, regenerateSummary, updateAction, updateMeeting, uploadTranscript } from "@/services/api";
import type { MeetingListItem, MeetingPayload } from "@/types";

import { ActionItemsPanel } from "./ActionItemsPanel";
import { AudioPlayer } from "./AudioPlayer";
import { SummaryPanel } from "./SummaryPanel";
import { TranscriptPanel } from "./TranscriptPanel";
import { TranscriptUploadModal } from "./TranscriptUploadModal";

export function MeetingDetailPage({ meetingId }: { meetingId: number }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: meeting, isLoading, isError } = useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: () => getMeeting(meetingId),
  });

  const duration = useMemo(() => {
    if (!meeting) return 0;
    const transcriptEnd = Math.max(0, ...meeting.transcript_segments.map((segment) => segment.end_time_seconds));
    return Math.max(meeting.duration_seconds, transcriptEnd);
  }, [meeting]);

  const invalidateMeeting = () => queryClient.invalidateQueries({ queryKey: ["meeting", meetingId] });

  const updateMutation = useMutation({
    mutationFn: (payload: MeetingPayload) => updateMeeting(meetingId, payload),
    onSuccess: () => {
      invalidateMeeting();
      setEditOpen(false);
      showToast("Meeting updated");
    },
    onError: () => showToast("Could not update meeting", "error"),
  });

  const uploadMutation = useMutation({
    mutationFn: (text: string) => uploadTranscript(meetingId, text),
    onSuccess: () => {
      invalidateMeeting();
      setUploadOpen(false);
      showToast("Upload successful");
    },
    onError: () => showToast("Could not upload transcript", "error"),
  });

  const summaryMutation = useMutation({
    mutationFn: () => regenerateSummary(meetingId),
    onSuccess: () => {
      invalidateMeeting();
      showToast("Summary regenerated");
    },
    onError: () => showToast("Could not regenerate summary", "error"),
  });

  const createActionMutation = useMutation({
    mutationFn: (payload: { description: string; owner: string; due_date: string }) =>
      createAction(meetingId, { description: payload.description, owner: payload.owner || null, due_date: payload.due_date || null }),
    onSuccess: () => {
      invalidateMeeting();
      showToast("Action item added");
    },
    onError: () => showToast("Could not add action item", "error"),
  });

  const updateActionMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof updateAction>[1] }) => updateAction(id, payload),
    onSuccess: () => {
      invalidateMeeting();
      showToast("Action updated");
    },
    onError: () => showToast("Could not update action", "error"),
  });

  const deleteActionMutation = useMutation({
    mutationFn: deleteAction,
    onSuccess: () => {
      invalidateMeeting();
      showToast("Action deleted");
    },
    onError: () => showToast("Could not delete action", "error"),
  });

  if (isLoading) {
    return (
      <AppShell>
        <TopNavbar title="Loading meeting" />
        <div className="grid gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Skeleton className="h-[620px]" />
          <Skeleton className="h-[620px]" />
        </div>
      </AppShell>
    );
  }

  if (isError || !meeting) {
    return (
      <AppShell>
        <TopNavbar title="Meeting unavailable" action={<BackButton />} />
        <div className="p-6 text-sm text-muted">Check that the Django API is running and the meeting still exists.</div>
      </AppShell>
    );
  }

  const meetingListShape: MeetingListItem = {
    id: meeting.id,
    title: meeting.title,
    meeting_date: meeting.meeting_date,
    duration_seconds: meeting.duration_seconds,
    participants: meeting.participants,
    summary_preview: meeting.summary?.overview ?? "",
    action_count: meeting.action_items.length,
  };

  return (
    <AppShell>
      <TopNavbar
        title={meeting.title}
        subtitle={`${new Date(meeting.meeting_date).toLocaleString()} - ${meeting.participants.join(", ")}`}
        action={
          <div className="flex flex-wrap gap-2">
            <BackButton />
            <Button variant="secondary" onClick={() => setUploadOpen(true)}>
              <FileUp className="h-4 w-4" />
              Transcript
            </Button>
            <Button onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </div>
        }
      />
      <div className="grid gap-4 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <AudioPlayer duration={duration} currentTime={currentTime} onSeek={setCurrentTime} />
          <TranscriptPanel
            segments={meeting.transcript_segments}
            currentTime={currentTime}
            query={query}
            selectedMatch={selectedMatch}
            onQueryChange={(value) => {
              setQuery(value);
              setSelectedMatch(0);
            }}
            onSelectMatch={setSelectedMatch}
            onSeek={setCurrentTime}
          />
        </div>
        <aside className="space-y-4">
          <SummaryPanel summary={meeting.summary} regenerating={summaryMutation.isPending} onRegenerate={() => summaryMutation.mutate()} />
          <ActionItemsPanel
            actions={meeting.action_items}
            onCreate={async (payload) => { await createActionMutation.mutateAsync(payload); }}
            onUpdate={async (id, payload) => { await updateActionMutation.mutateAsync({ id, payload: { ...payload, due_date: payload.due_date || null } }); }}
            onDelete={async (id) => { await deleteActionMutation.mutateAsync(id); }}
          />
        </aside>
      </div>
      <MeetingFormModal open={editOpen} mode="edit" meeting={meetingListShape} onClose={() => setEditOpen(false)} onSubmit={async (payload) => { await updateMutation.mutateAsync(payload); }} />
      <TranscriptUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} onSubmit={async (text) => { await uploadMutation.mutateAsync(text); }} />
    </AppShell>
  );
}

function BackButton() {
  return (
    <Link
      href="/"
      className={cn("focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-line bg-white px-4 text-sm font-medium text-ink transition hover:bg-slate-50")}
    >
      <ArrowLeft className="h-4 w-4" />
      Library
    </Link>
  );
}
