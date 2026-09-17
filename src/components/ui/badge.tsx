import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide border transition-colors",
  {
    variants: {
      variant: {
        default: "bg-surface-muted text-foreground border-border/70",
        blue: "bg-blue-light/90 text-blue-2 border-blue/20",
        emerald: "bg-emerald-light/90 text-emerald border-emerald/20",
        amber: "bg-amber-light/90 text-amber border-amber/20",
        rose: "bg-rose-light/90 text-rose border-rose/20",
        violet: "bg-violet-light/90 text-violet border-violet/20",
        navy: "bg-navy text-white border-transparent shadow-2xs",
        outline: "bg-transparent text-muted-foreground border-border-strong/80",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
