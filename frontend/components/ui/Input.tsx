import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "focus-ring h-10 w-full rounded-[10px] border border-line bg-white px-3 text-sm text-ink placeholder:text-slate-400",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "focus-ring min-h-28 w-full resize-y rounded-[10px] border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-slate-400",
        className,
      )}
      {...props}
    />
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-slate-700">{children}</label>;
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs font-medium text-danger">{message}</p>;
}
