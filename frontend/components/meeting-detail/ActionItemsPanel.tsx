"use client";

import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { FieldError, Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { ActionItem } from "@/types";

interface ActionFormValues {
  description: string;
  owner: string;
  due_date: string;
}

interface ActionItemsPanelProps {
  actions: ActionItem[];
  onCreate: (payload: ActionFormValues) => Promise<void>;
  onUpdate: (id: number, payload: Partial<ActionFormValues & { completed: boolean }>) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export function ActionItemsPanel({ actions, onCreate, onUpdate, onDelete }: ActionItemsPanelProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<ActionFormValues>({ description: "", owner: "", due_date: "" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ActionFormValues>({ defaultValues: { description: "", owner: "", due_date: "" } });

  async function submit(values: ActionFormValues) {
    await onCreate({ description: values.description.trim(), owner: values.owner.trim(), due_date: values.due_date || "" });
    reset();
  }

  return (
    <section className="rounded-2xl border border-line bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">Action items</h2>
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-success">{actions.filter((action) => !action.completed).length} open</span>
      </div>
      <form className="mb-4 space-y-2 rounded-xl bg-slate-50 p-3" onSubmit={handleSubmit(submit)}>
        <Input {...register("description", { required: "Description is required" })} placeholder="Add an action item" />
        <FieldError message={errors.description?.message} />
        <div className="grid gap-2 sm:grid-cols-[1fr_150px_auto]">
          <Input {...register("owner")} placeholder="Owner" />
          <Input type="date" {...register("due_date")} />
          <Button type="submit" disabled={isSubmitting}>
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>
      </form>
      <div className="space-y-2">
        {actions.map((action) => {
          const editing = editingId === action.id;
          return (
            <div key={action.id} className={cn("rounded-xl border border-line p-3", action.completed ? "bg-slate-50 opacity-75" : "bg-white")}>
              {editing ? (
                <div className="space-y-2">
                  <Input value={draft.description} onChange={(event) => setDraft((value) => ({ ...value, description: event.target.value }))} />
                  <div className="grid gap-2 sm:grid-cols-[1fr_150px_auto_auto]">
                    <Input value={draft.owner} onChange={(event) => setDraft((value) => ({ ...value, owner: event.target.value }))} placeholder="Owner" />
                    <Input type="date" value={draft.due_date} onChange={(event) => setDraft((value) => ({ ...value, due_date: event.target.value }))} />
                    <Button
                      size="icon"
                      aria-label="Save action"
                      onClick={async () => {
                        await onUpdate(action.id, draft);
                        setEditingId(null);
                      }}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="icon" aria-label="Cancel edit" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-primary"
                    checked={action.completed}
                    onChange={(event) => onUpdate(action.id, { completed: event.target.checked })}
                    aria-label={`Complete ${action.description}`}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm font-medium leading-6 text-ink", action.completed && "line-through")}>{action.description}</p>
                    <p className="text-xs text-muted">
                      {action.owner || "Unassigned"}
                      {action.due_date ? ` - ${new Date(action.due_date).toLocaleDateString()}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Edit action"
                      onClick={() => {
                        setEditingId(action.id);
                        setDraft({ description: action.description, owner: action.owner ?? "", due_date: action.due_date ?? "" });
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Delete action" onClick={() => onDelete(action.id)}>
                      <Trash2 className="h-4 w-4 text-danger" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
