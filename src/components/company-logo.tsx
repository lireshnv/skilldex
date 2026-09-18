import { cn } from "@/lib/utils";

// A real brand-tile monogram (like Slack/Notion app icons) instead of a
// generic Lucide "Building2" icon repeated identically for every company —
// each company's own logoColor + initials make every card visually distinct
// instead of reading as one templated icon-in-a-box pattern.
export function CompanyLogo({
  name,
  color = "#1d4ed8",
  size = 36,
  className,
}: {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] font-bold text-white", className)}
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}
