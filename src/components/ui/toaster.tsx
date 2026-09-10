"use client";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import { useSkillDexStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

const iconMap = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: XCircle,
};
const colorMap = {
  default: "text-blue-2 bg-blue-light",
  success: "text-emerald bg-emerald-light",
  warning: "text-amber bg-amber-light",
  error: "text-rose bg-rose-light",
};

export function Toaster() {
  const toasts = useSkillDexStore((s) => s.toasts);
  const dismissToast = useSkillDexStore((s) => s.dismissToast);
  const mounted = useMounted();
  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-[200] flex w-full max-w-sm flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = iconMap[t.variant ?? "default"];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40 }}
              className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-4 shadow-[var(--shadow-lg)]"
            >
              <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", colorMap[t.variant ?? "default"])}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{t.title}</p>
                {t.description && <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>}
              </div>
              <button onClick={() => dismissToast(t.id)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body
  );
}
