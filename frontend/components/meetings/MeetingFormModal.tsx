"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { FieldError, FieldLabel, Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { toDateInputValue } from "@/lib/utils";
import type { MeetingListItem, MeetingPayload } from "@/types";

interface MeetingFormValues {
  title: string;
  meeting_date: string;
  duration_minutes: number;
  participants: string;
  text: string;
}

interface MeetingFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  meeting?: MeetingListItem | null;
  onClose: () => void;
  onSubmit: (payload: MeetingPayload) => Promise<void>;
}

export function MeetingFormModal({ open, mode, meeting, onClose, onSubmit }: MeetingFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MeetingFormValues>({
    defaultValues: {
      title: "",
      meeting_date: new Date().toISOString().slice(0, 16),
      duration_minutes: 30,
      participants: "",
      text: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      title: meeting?.title ?? "",
      meeting_date: meeting ? toDateInputValue(meeting.meeting_date) : new Date().toISOString().slice(0, 16),
      duration_minutes: meeting ? Math.max(1, Math.round(meeting.duration_seconds / 60)) : 30,
      participants: meeting?.participants.join(", ") ?? "",
      text: "",
    });
  }, [meeting, open, reset]);

  const submit = handleSubmit(async (values) => {
    await onSubmit({
      title: values.title.trim(),
      meeting_date: new Date(values.meeting_date).toISOString(),
      duration_seconds: Math.max(0, Number(values.duration_minutes) * 60),
      participants: values.participants
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean),
      text: values.text.trim() || undefined,
    });
  });

  return (
    <Modal title={mode === "create" ? "Create meeting" : "Edit meeting"} open={open} onClose={onClose}>
      <form className="space-y-4" onSubmit={submit}>
        <div className="space-y-2">
          <FieldLabel>Title *</FieldLabel>
          <Input {...register("title", { required: "Title is required" })} placeholder="Weekly Product Sync" />
          <FieldError message={errors.title?.message} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel>Date *</FieldLabel>
            <Input type="datetime-local" {...register("meeting_date", { required: "Date is required" })} />
            <FieldError message={errors.meeting_date?.message} />
          </div>
          <div className="space-y-2">
            <FieldLabel>Duration minutes *</FieldLabel>
            <Controller
              control={control}
              name="duration_minutes"
              rules={{ min: { value: 0, message: "Duration must be positive" } }}
              render={({ field }) => <Input type="number" min={0} {...field} />}
            />
            <FieldError message={errors.duration_minutes?.message} />
          </div>
        </div>
        <div className="space-y-2">
          <FieldLabel>Participants</FieldLabel>
          <Input {...register("participants")} placeholder="Alice, Bob, Priya" />
        </div>
        {mode === "create" ? (
          <div className="space-y-2">
            <FieldLabel>Transcript paste</FieldLabel>
            <Textarea
              {...register("text")}
              placeholder="[00:00] Alice: Welcome everyone.
[00:18] Bob: The dashboard search is ready for review."
            />
          </div>
        ) : null}
        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : mode === "create" ? "Create meeting" : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
