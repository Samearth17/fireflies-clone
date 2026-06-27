"use client";

import { Brain, CheckCircle2, ListChecks, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { Summary } from "@/types";

interface SummaryPanelProps {
  summary: Summary | null;
  onRegenerate: () => void;
  regenerating: boolean;
}

export function SummaryPanel({ summary, onRegenerate, regenerating }: SummaryPanelProps) {
  return (
    <section className="space-y-3">
      <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
            <Brain className="h-5 w-5 text-primary" />
            AI summary
          </h2>
          <Button variant="secondary" size="sm" onClick={onRegenerate} disabled={regenerating}>
            <Sparkles className="h-4 w-4" />
            {regenerating ? "Refreshing" : "Regenerate"}
          </Button>
        </div>
        <p className="text-sm leading-6 text-slate-700">{summary?.overview ?? "Summary will appear after transcript content is added."}</p>
      </div>
      <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
          <ListChecks className="h-4 w-4 text-cyan" />
          Key topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {(summary?.key_topics ?? ["Follow-Up"]).map((topic) => (
            <span key={topic} className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan">
              {topic}
            </span>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-white p-4 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
          <CheckCircle2 className="h-4 w-4 text-success" />
          Decisions
        </h3>
        <ul className="space-y-2">
          {(summary?.decisions ?? ["Add transcript content to generate decisions."]).map((decision) => (
            <li key={decision} className="rounded-xl bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
              {decision}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
