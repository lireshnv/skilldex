import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse-soft rounded-[var(--radius-sm)] bg-surface-muted", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
}
