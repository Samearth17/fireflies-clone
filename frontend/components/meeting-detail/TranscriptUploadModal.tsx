"use client";

import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { FieldError, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export function TranscriptUploadModal({ open, onClose, onSubmit }: { open: boolean; onClose: () => void; onSubmit: (text: string) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<{ text: string }>({ defaultValues: { text: "" } });

  return (
    <Modal title="Update transcript" open={open} onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values.text);
          reset();
        })}
      >
        <Textarea
          className="min-h-64"
          {...register("text", { required: "Transcript text is required" })}
          placeholder="[00:00] Alice: Welcome everyone.
[00:12] Bob: The summary panel looks good."
        />
        <FieldError message={errors.text?.message} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Uploading..." : "Upload transcript"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
