import { cn } from "@/lib/utils";

// A small uppercase eyebrow above a content block's heading — the same
// "labeled section" language the sidebar already uses for its groups,
// applied to the main content so dashboards read as organized sections
// rather than a loose stack of same-looking cards.
export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70", className)}>
      <span className="h-1 w-1 rounded-full bg-muted-foreground/50" />
      {children}
    </p>
  );
}
