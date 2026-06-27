"use client";

import { CalendarDays, Menu, Search, Settings, UserCircle2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function AppShell({ children, active = "meetings" }: { children: React.ReactNode; active?: "meetings" | "search" | "settings" }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const nav = (
    <nav className="flex h-full flex-col">
      <Link href="/" className="mb-8 flex items-center gap-3 px-2 text-ink">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white">F</div>
        <div>
          <p className="text-base font-semibold leading-tight">Fireflies</p>
          <p className="text-xs text-muted">Workspace</p>
        </div>
      </Link>
      <div className="space-y-1">
        <SidebarItem href="/" icon={<CalendarDays className="h-5 w-5" />} label="Meetings" active={active === "meetings"} />
        <SidebarItem href="/" icon={<Search className="h-5 w-5" />} label="Search" active={active === "search"} />
        <SidebarItem href="/" icon={<Settings className="h-5 w-5" />} label="Settings" active={active === "settings"} />
      </div>
      <div className="mt-auto rounded-2xl border border-line bg-white p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <UserCircle2 className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">Demo User</p>
            <p className="text-xs text-muted">Settings soon</p>
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-slate-50/90 p-5 lg:block">{nav}</aside>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/90 px-4 backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-white">F</span>
          Fireflies
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(true)} aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </Button>
      </header>
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-slate-950/30" onClick={() => setDrawerOpen(false)} aria-label="Close navigation" />
          <aside className="relative h-full w-72 bg-slate-50 p-5 shadow-soft">
            <div className="mb-4 flex justify-end">
              <Button variant="ghost" size="icon" onClick={() => setDrawerOpen(false)} aria-label="Close navigation">
                <X className="h-5 w-5" />
              </Button>
            </div>
            {nav}
          </aside>
        </div>
      )}
      <main className="lg:pl-64">{children}</main>
    </div>
  );
}

function SidebarItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
        active ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:bg-white hover:text-ink",
      )}
    >
      {icon}
      {label}
    </Link>
  );
}
