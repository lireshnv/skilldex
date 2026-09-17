import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40 focus-visible:ring-offset-1 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-navy text-white hover:bg-navy-2 shadow-sm hover:shadow",
        primary: "bg-blue text-white hover:bg-blue-2 shadow-sm hover:shadow-[0_4px_14px_rgba(37,99,235,0.35)]",
        outline: "border border-border-strong bg-surface text-foreground hover:bg-surface-muted hover:border-border-strong/80",
        ghost: "text-foreground hover:bg-surface-muted",
        subtle: "bg-surface-muted text-foreground hover:bg-border/60",
        destructive: "bg-rose text-white hover:opacity-90 shadow-sm",
        link: "text-blue underline-offset-4 hover:underline p-0 h-auto active:scale-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs rounded-[var(--radius-sm)]",
        lg: "h-12 px-6 text-base font-semibold",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
