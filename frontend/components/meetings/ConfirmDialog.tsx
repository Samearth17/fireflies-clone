"use client";

import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel, onClose, onConfirm }: ConfirmDialogProps) {
  return (
    <Modal title={title} open={open} onClose={onClose}>
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-danger">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm leading-6 text-slate-600">{message}</p>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
