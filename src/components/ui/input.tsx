import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3.5 py-2 text-sm placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:outline-none focus-visible:border-blue focus-visible:ring-3 focus-visible:ring-blue/15 transition-all",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-20 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3.5 py-2 text-sm placeholder:text-muted-foreground/70 hover:border-border-strong focus-visible:outline-none focus-visible:border-blue focus-visible:ring-3 focus-visible:ring-blue/15 transition-all",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-[var(--radius-md)] border border-border bg-surface px-3.5 py-2 text-sm hover:border-border-strong focus-visible:outline-none focus-visible:border-blue focus-visible:ring-3 focus-visible:ring-blue/15 transition-all cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
