"use client";
import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";

export function Drawer({
  open,
  onOpenChange,
  title,
  side = "right",
  width = 420,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: React.ReactNode;
  side?: "left" | "right";
  width?: number;
  children: React.ReactNode;
}) {
  const mounted = useMounted();
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onOpenChange(false);
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />
          <motion.div
            initial={{ x: side === "right" ? width : -width }}
            animate={{ x: 0 }}
            exit={{ x: side === "right" ? width : -width }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            style={{ width, maxWidth: "92vw" }}
            className={cn(
              "relative z-10 flex h-full flex-col bg-surface shadow-[var(--shadow-lg)]",
              side === "right" ? "ml-auto" : "mr-auto"
            )}
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="text-sm font-semibold text-foreground">{title}</div>
              <button
                onClick={() => onOpenChange(false)}
                className="rounded-full p-1.5 text-muted-foreground hover:bg-surface-muted cursor-pointer"
                aria-label="Close panel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
