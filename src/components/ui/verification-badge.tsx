import { CircleDashed, ClipboardCheck, FolderGit2, GraduationCap, ShieldCheck } from "lucide-react";
import { Badge } from "./badge";
import type { VerificationLevel } from "@/lib/types";

// Distinguishes verification tiers by icon, not by adding more colors —
// only two tones are used (neutral for unverified, emerald as trust grows),
// consistent with keeping color meaningful rather than decorative.
const config: Record<VerificationLevel, { icon: typeof CircleDashed; variant: "outline" | "blue" | "emerald" }> = {
  "Self Declared": { icon: CircleDashed, variant: "outline" },
  "Assessed": { icon: ClipboardCheck, variant: "blue" },
  "Project Verified": { icon: FolderGit2, variant: "emerald" },
  "Faculty Verified": { icon: GraduationCap, variant: "emerald" },
  "Industry Verified": { icon: ShieldCheck, variant: "emerald" },
};

export function VerificationBadge({ level, className }: { level: VerificationLevel; className?: string }) {
  const { icon: Icon, variant } = config[level];
  return (
    <Badge variant={variant} className={className}>
      <Icon className="h-3 w-3" /> {level}
    </Badge>
  );
}
