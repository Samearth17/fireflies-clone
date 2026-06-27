"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Filter, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";
import { useMeetings } from "@/hooks/useMeetings";
import { createMeeting, deleteMeeting, updateMeeting } from "@/services/api";
import type { MeetingListItem, MeetingPayload } from "@/types";

import { ConfirmDialog } from "./ConfirmDialog";
import { MeetingCard } from "./MeetingCard";
import { MeetingFormModal } from "./MeetingFormModal";

export function Dashboard() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState<"recent" | "oldest">("recent");
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingListItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const filters = useMemo(() => ({ search, date, sort }), [search, date, sort]);
  const { data: meetings = [], isLoading, isError, refetch } = useMeetings(filters);

  const createMutation = useMutation({
    mutationFn: createMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setFormOpen(false);
      showToast("Meeting created");
    },
    onError: () => showToast("Could not create meeting", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: MeetingPayload }) => updateMeeting(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setFormOpen(false);
      showToast("Meeting updated");
    },
    onError: () => showToast("Could not update meeting", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      setConfirmOpen(false);
      showToast("Meeting deleted");
    },
    onError: () => showToast("Could not delete meeting", "error"),
  });

  return (
    <AppShell>
      <TopNavbar
        title="Meetings"
        subtitle="Browse recordings, transcripts, summaries, and next steps."
        action={
          <Button
            onClick={() => {
              setSelectedMeeting(null);
              setFormMode("create");
              setFormOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            New meeting
          </Button>
        }
      />
      <section className="px-4 py-5 sm:px-6">
        <div className="mb-5 grid gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm md:grid-cols-[1fr_180px_170px_auto]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or participant" aria-label="Search meetings" />
          </label>
          <label className="relative">
            <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input className="pl-9" type="date" value={date} onChange={(event) => setDate(event.target.value)} aria-label="Filter by date" />
          </label>
          <label className="relative">
            <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              className="focus-ring h-10 w-full rounded-[10px] border border-line bg-white pl-9 pr-3 text-sm text-ink"
              value={sort}
              onChange={(event) => setSort(event.target.value as "recent" | "oldest")}
              aria-label="Sort meetings"
            >
              <option value="recent">Recent first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
          <Button variant="secondary" onClick={() => refetch()}>
            Refresh
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-56" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState title="Could not load meetings" detail="Check that the Django API is running." />
        ) : meetings.length === 0 ? (
          <EmptyState title="No meetings found" detail="Try another search or add a new meeting." />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onEdit={(item) => {
                  setSelectedMeeting(item);
                  setFormMode("edit");
                  setFormOpen(true);
                }}
                onDelete={(item) => {
                  setSelectedMeeting(item);
                  setConfirmOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </section>
      <MeetingFormModal
        open={formOpen}
        mode={formMode}
        meeting={selectedMeeting}
        onClose={() => setFormOpen(false)}
        onSubmit={async (payload) => {
          if (formMode === "edit" && selectedMeeting) {
            await updateMutation.mutateAsync({ id: selectedMeeting.id, payload });
          } else {
            await createMutation.mutateAsync(payload);
          }
        }}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete meeting"
        message={`Delete "${selectedMeeting?.title ?? "this meeting"}" and all transcript, summary, and action data?`}
        confirmLabel="Delete"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => selectedMeeting && deleteMutation.mutate(selectedMeeting.id)}
      />
    </AppShell>
  );
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white px-6 text-center">
      <div className="mb-4 grid h-20 w-20 place-items-center rounded-3xl bg-slate-100">
        <Search className="h-9 w-9 text-slate-400" />
      </div>
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </div>
  );
}
