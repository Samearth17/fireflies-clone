"use client";

import { Bell, Settings, UserCircle2 } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function TopNavbar({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 border-b border-line bg-white px-4 py-5 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal text-ink sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </div>
      <div className="flex max-w-full flex-wrap items-center gap-2">
        {action}
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <UserCircle2 className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
