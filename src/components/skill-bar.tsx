import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

function colorFor(value: number) {
  if (value >= 75) return "var(--accent-emerald)";
  if (value >= 50) return "var(--brand-blue)";
  return "var(--accent-amber)";
}

export function SkillBar({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-semibold text-muted-foreground">{Math.round(value)}%</span>
      </div>
      <Progress value={value} color={colorFor(value)} />
    </div>
  );
}
