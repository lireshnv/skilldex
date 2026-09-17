"use client";
import * as React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/use-mounted";
import { useSkillDexStore } from "@/lib/store";
import { PortalKey, portalMeta } from "@/lib/nav-config";
import { students, companies, colleges, assessmentDefs } from "@/lib/data";

interface PaletteItem {
  id: string;
  label: string;
  sublabel?: string;
  section: string;
  href: string;
}

function buildQuickActions(portal: PortalKey): PaletteItem[] {
  return portalMeta[portal].nav.map((n) => ({
    id: `nav-${n.href}`,
    label: n.label,
    section: "Quick actions",
    href: n.href,
  }));
}

function search(query: string): PaletteItem[] {
  const q = query.toLowerCase();
  const results: PaletteItem[] = [];

  for (const s of students) {
    if (results.filter((r) => r.section === "Students").length >= 5) break;
    if (s.name.toLowerCase().includes(q) || s.targetRole.toLowerCase().includes(q)) {
      results.push({ id: `stu-${s.id}`, label: s.name, sublabel: `${s.targetRole} · ${s.college}`, section: "Students", href: `/industry/recruiter/candidates/${s.id}` });
    }
  }
  for (const c of companies) {
    if (results.filter((r) => r.section === "Companies").length >= 5) break;
    if (c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)) {
      results.push({ id: `cmp-${c.id}`, label: c.name, sublabel: `${c.industry} · ${c.location}`, section: "Companies", href: `/institution/student/companies/${c.id}` });
    }
  }
  for (const c of colleges) {
    if (results.filter((r) => r.section === "Colleges").length >= 5) break;
    if (c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q)) {
      results.push({ id: `col-${c.id}`, label: c.name, sublabel: `${c.city}, ${c.state}`, section: "Colleges", href: `/industry/company/colleges/${c.id}` });
    }
  }
  for (const a of assessmentDefs) {
    if (results.filter((r) => r.section === "Assessments").length >= 5) break;
    if (a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)) {
      results.push({ id: `asm-${a.id}`, label: a.title, sublabel: `${a.category} · ${a.difficulty}`, section: "Assessments", href: `/institution/student/assessment/${a.id}` });
    }
  }
  return results;
}

export function CommandPalette({ portal }: { portal: PortalKey }) {
  const open = useSkillDexStore((s) => s.commandPaletteOpen);
  const setOpen = useSkillDexStore((s) => s.setCommandPaletteOpen);
  const mounted = useMounted();
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Global Cmd/Ctrl+K shortcut, from anywhere in the app.
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  const items = React.useMemo(
    () => (query.trim() ? search(query) : buildQuickActions(portal)),
    [query, portal]
  );

  React.useEffect(() => setActiveIndex(0), [query]);

  function activate(item: PaletteItem) {
    setOpen(false);
    router.push(item.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, items.length - 1)); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); return; }
    if (e.key === "Enter" && items[activeIndex]) { e.preventDefault(); activate(items[activeIndex]); }
  }

  if (!mounted) return null;

  const sections = Array.from(new Set(items.map((i) => i.section)));
  let runningIndex = -1;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-start justify-center px-4 pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15 }}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-lg)]"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-2.5 border-b border-border px-4">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students, companies, colleges, assessments..."
                className="h-12 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <kbd className="hidden shrink-0 rounded border border-border-strong px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">Esc</kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {items.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;.</p>
              )}
              {sections.map((section) => (
                <div key={section} className="mb-1">
                  <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{section}</p>
                  {items.filter((i) => i.section === section).map((item) => {
                    runningIndex += 1;
                    const idx = runningIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => activate(item)}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          "flex w-full items-center justify-between gap-3 rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm cursor-pointer",
                          idx === activeIndex ? "bg-blue-light text-blue-2" : "text-foreground hover:bg-surface-muted"
                        )}
                      >
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{item.label}</span>
                          {item.sublabel && <span className="block truncate text-xs text-muted-foreground">{item.sublabel}</span>}
                        </span>
                        {idx === activeIndex && <CornerDownLeft className="h-3.5 w-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="hidden items-center gap-4 border-t border-border px-4 py-2 text-[11px] text-muted-foreground sm:flex">
              <span className="flex items-center gap-1"><ArrowUp className="h-3 w-3" /><ArrowDown className="h-3 w-3" /> Navigate</span>
              <span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> Select</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
