"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronsLeft, ChevronsRight, Compass, ArrowLeftRight, ChevronDown,
  Sparkles, Settings, CircleHelp, LogOut, UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { NavItem, NavGroup, PortalKey, portalMeta } from "@/lib/nav-config";
import { useSkillDexStore } from "@/lib/store";

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform ?? navigator.userAgent);

function Kbd({ n }: { n: number }) {
  return (
    <span className="hidden shrink-0 items-center gap-0.5 lg:flex">
      <kbd className="flex h-5 min-w-5 items-center justify-center rounded border border-border-strong bg-surface-interactive px-1 text-[10px] font-medium text-muted-foreground">
        {isMac ? "⌘" : "Ctrl"}
      </kbd>
      <kbd className="flex h-5 min-w-5 items-center justify-center rounded border border-border-strong bg-surface-interactive px-1 text-[10px] font-medium text-muted-foreground">
        {n}
      </kbd>
    </span>
  );
}

function NavLink({ item, collapsed, shortcut, onNavigate }: { item: NavItem; collapsed: boolean; shortcut?: number; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href;
  const Icon = item.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <Link
        href={item.href}
        onClick={onNavigate}
        title={collapsed ? item.label : undefined}
        className={cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 select-none",
          active ? "text-foreground" : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
          collapsed && "justify-center px-2"
        )}
      >
        {active && (
          <motion.span
            layoutId="sidebar-active-pill"
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
            className="absolute inset-0 rounded-xl border"
            style={{ background: "rgba(80,120,255,0.12)", borderColor: "rgba(100,140,255,0.18)" }}
          >
            <span className="absolute inset-y-1.5 left-0 w-[3px] rounded-r-full bg-blue-2" />
          </motion.span>
        )}
        <Icon className={cn("relative h-[19px] w-[19px] shrink-0 transition-transform duration-150 group-hover:scale-105", active && "text-blue-2")} />
        {!collapsed && <span className="relative truncate">{item.label}</span>}
        {!collapsed && shortcut !== undefined && item.label.length <= 14 && (
          <span className="relative ml-auto">
            <Kbd n={shortcut} />
          </span>
        )}
      </Link>

      {collapsed && hovered && (
        <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-lg border border-border-strong bg-surface-elevated px-2.5 py-1.5 text-xs font-medium text-foreground shadow-[var(--shadow-lg)]">
          {item.label}
          {shortcut !== undefined && <span className="ml-1.5 text-muted-foreground">{isMac ? "⌘" : "Ctrl"}{shortcut}</span>}
        </div>
      )}
    </div>
  );
}

function NavSection({ group, collapsed, shortcutStart, onNavigate }: { group: NavGroup; collapsed: boolean; shortcutStart: number; onNavigate?: () => void }) {
  const [open, setOpen] = useState(true);
  const collapsible = !!group.label && group.items.length > 1;

  return (
    <div>
      {group.label && !collapsed && (
        <button
          onClick={() => collapsible && setOpen((v) => !v)}
          className={cn(
            "mb-1 flex w-full items-center justify-between px-3 pb-1 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/60",
            collapsible && "cursor-pointer hover:text-muted-foreground"
          )}
        >
          {group.label}
          {collapsible && (
            <ChevronDown className={cn("h-3 w-3 transition-transform duration-200", !open && "-rotate-90")} />
          )}
        </button>
      )}
      <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: open || collapsed ? "1fr" : "0fr" }}>
        <div className="space-y-0.5 overflow-hidden">
          {group.items.map((item, i) => (
            <NavLink key={item.href} item={item} collapsed={collapsed} shortcut={shortcutStart + i} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}

function useSidebarShortcuts(flatItems: { href: string }[]) {
  const router = useRouter();
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const mod = isMac ? e.metaKey : e.ctrlKey;
      if (!mod) return;
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1 || n > 9) return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      const item = flatItems[n - 1];
      if (!item) return;
      e.preventDefault();
      router.push(item.href);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flatItems, router]);
}

export function SidebarContent({
  portal,
  collapsed,
  userName,
  userColor,
  userRole,
  onNavigate,
}: {
  portal: PortalKey;
  collapsed: boolean;
  userName?: string;
  userColor?: string;
  userRole?: string;
  onNavigate?: () => void;
}) {
  const meta = portalMeta[portal];
  const setAiCopilotOpen = useSkillDexStore((s) => s.setAiCopilotOpen);
  const pushToast = useSkillDexStore((s) => s.pushToast);
  const [profileOpen, setProfileOpen] = useState(false);

  const shortcutStarts = useMemo(() => {
    let running = 1;
    return meta.nav.map((g) => {
      const start = running;
      running += g.items.length;
      return start;
    });
  }, [meta.nav]);

  const flatItems = useMemo(() => meta.nav.flatMap((g) => g.items), [meta.nav]);
  useSidebarShortcuts(flatItems);

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center gap-2 px-4 py-5", collapsed && "justify-center px-2")}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-navy text-sm font-bold text-white">
          SD
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="text-sm font-bold text-foreground">SkillDex</p>
            <p className="text-[10px] text-muted-foreground">{meta.title}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-2 pb-4">
        {meta.nav.map((group, i) => (
          <NavSection key={group.label || group.items[0].href} group={group} collapsed={collapsed} shortcutStart={shortcutStarts[i]} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-border p-2">
        <button
          onClick={() => setAiCopilotOpen(true)}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-foreground cursor-pointer",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "SkillDex AI" : undefined}
        >
          <Sparkles className="h-[19px] w-[19px] shrink-0 text-sky" />
          {!collapsed && <span>SkillDex AI</span>}
        </button>

        {portal === "student" ? (
          <Link
            href="/institution/student/settings"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="h-[19px] w-[19px] shrink-0" />
            {!collapsed && <span>Settings</span>}
          </Link>
        ) : (
          <button
            onClick={() => pushToast({ title: "Settings", description: "Workspace preferences are coming soon." })}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-foreground cursor-pointer",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "Settings" : undefined}
          >
            <Settings className="h-[19px] w-[19px] shrink-0" />
            {!collapsed && <span>Settings</span>}
          </button>
        )}

        <button
          onClick={() => pushToast({ title: "Help & Support", description: "Ask SkillDex AI, or reach out to support@skilldex.app." })}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-foreground cursor-pointer",
            collapsed && "justify-center px-2"
          )}
          title={collapsed ? "Help & Support" : undefined}
        >
          <CircleHelp className="h-[19px] w-[19px] shrink-0" />
          {!collapsed && <span>Help & Support</span>}
        </button>
      </div>

      {userName && (
        <div className="relative border-t border-border p-2">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            onBlur={() => setTimeout(() => setProfileOpen(false), 150)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-white/[0.04] cursor-pointer",
              collapsed && "justify-center px-0"
            )}
          >
            <Avatar name={userName} color={userColor ?? "#1d4ed8"} size={30} />
            {!collapsed && (
              <>
                <div className="min-w-0 flex-1 text-left leading-tight">
                  <p className="truncate text-xs font-semibold text-foreground">{userName}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{userRole}</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              </>
            )}
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-2 z-50 mb-1.5 w-52 overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface-elevated py-1.5 shadow-[var(--shadow-lg)]"
              >
                <div className="flex items-center gap-2.5 px-3 py-1.5 text-sm text-foreground"><UserRound className="h-4 w-4 text-muted-foreground" /> Profile</div>
                <div className="flex items-center gap-2.5 px-3 py-1.5 text-sm text-foreground"><Settings className="h-4 w-4 text-muted-foreground" /> Preferences</div>
                <div className="my-1 border-t border-border" />
                <Link href="/" className="flex items-center gap-2.5 px-3 py-1.5 text-sm text-foreground hover:bg-surface-muted"><LogOut className="h-4 w-4 text-muted-foreground" /> Sign Out</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="space-y-1 border-t border-border p-2">
        <Link
          href={meta.switchHref}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <Compass className="h-[19px] w-[19px] shrink-0" />
          {!collapsed && <span>Switch Workspace</span>}
        </Link>
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <ArrowLeftRight className="h-[19px] w-[19px] shrink-0" />
          {!collapsed && <span>Switch Portal</span>}
        </Link>
      </div>
    </div>
  );
}

export function DesktopSidebar({
  portal,
  userName,
  userColor,
  userRole,
}: {
  portal: PortalKey;
  userName?: string;
  userColor?: string;
  userRole?: string;
}) {
  const collapsed = useSkillDexStore((s) => s.sidebarCollapsed);
  const setCollapsed = useSkillDexStore((s) => s.setSidebarCollapsed);
  return (
    <aside
      className={cn(
        "relative hidden shrink-0 border-r border-border bg-surface/95 backdrop-blur-sm transition-all duration-200 lg:flex lg:flex-col",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <SidebarContent portal={portal} collapsed={collapsed} userName={userName} userColor={userColor} userRole={userRole} />
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground shadow-[var(--shadow-sm)] hover:text-foreground cursor-pointer"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsLeft className="h-3.5 w-3.5" />}
      </button>
    </aside>
  );
}
