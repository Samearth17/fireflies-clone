import { forwardRef, type ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ className, variant = "primary", size = "md", ...props }, ref) {
  const variants = {
    primary: "bg-primary text-white hover:bg-indigo-700",
    secondary: "border border-line bg-white text-ink hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-danger text-white hover:bg-red-700",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    icon: "h-10 w-10 p-0",
  };

  return (
    <button
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition disabled:cursor-not-allowed disabled:opacity-55",
        variants[variant],
        sizes[size],
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
