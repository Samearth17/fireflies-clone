"use client";

import { CheckCircle2, Info, XCircle } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type ToastKind = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  kind: ToastKind;
  title: string;
}

interface ToastContextValue {
  showToast: (title: string, kind?: ToastKind) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((title: string, kind: ToastKind = "success") => {
    const id = Date.now();
    setToasts((current) => [...current, { id, kind, title }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = toast.kind === "error" ? XCircle : toast.kind === "info" ? Info : CheckCircle2;
          return (
            <div
              key={toast.id}
              className={cn(
                "flex items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-soft",
                toast.kind === "error" ? "border-red-200 text-danger" : toast.kind === "info" ? "border-cyan-200 text-cyan" : "border-green-200 text-success",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span>{toast.title}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
