import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border",
  {
    variants: {
      variant: {
        default: "bg-surface-muted text-foreground border-border",
        blue: "bg-blue-light text-blue-2 border-transparent",
        emerald: "bg-emerald-light text-emerald border-transparent",
        amber: "bg-amber-light text-amber border-transparent",
        rose: "bg-rose-light text-rose border-transparent",
        violet: "bg-violet-light text-violet border-transparent",
        navy: "bg-navy text-white border-transparent",
        outline: "bg-transparent text-muted-foreground border-border-strong",
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
