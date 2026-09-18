"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Menu, Search, Sparkles, HelpCircle, ChevronDown, LogOut,
  Settings, UserRound, ArrowLeftRight, Bell,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Drawer } from "@/components/ui/drawer";
import { SidebarContent } from "./sidebar";
import { NotificationTray } from "./notification-tray";
import { PortalKey, portalMeta } from "@/lib/nav-config";
import { useSkillDexStore } from "@/lib/store";

export function Header({
  portal,
  userName,
  userColor,
  userRole,
}: {
  portal: PortalKey;
  userName: string;
  userColor: string;
  userRole: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const setAiCopilotOpen = useSkillDexStore((s) => s.setAiCopilotOpen);
  const setCommandPaletteOpen = useSkillDexStore((s) => s.setCommandPaletteOpen);
  const meta = portalMeta[portal];
  const notifHref = portal === "student"
    ? "/institution/student/notifications"
    : portal === "faculty" ? "/institution/faculty/notifications"
    : portal === "placement" ? "/institution/placement/notifications"
    : portal === "recruiter" ? "/industry/recruiter/notifications"
    : "/industry/company/notifications";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur">
      <button
        onClick={() => setMobileOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-muted-foreground hover:bg-surface-muted lg:hidden cursor-pointer"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
        <span className="rounded-full bg-surface-muted px-2.5 py-1 font-medium text-foreground">{meta.org}</span>
        <span className="flex items-center gap-1 rounded-full border border-amber/25 bg-amber-light px-2.5 py-1 font-semibold text-amber">
          <span className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse-soft" /> Demo data
        </span>
      </div>

      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="relative ml-auto flex h-9 w-full max-w-sm flex-1 items-center rounded-[var(--radius-md)] border border-border bg-surface-muted/60 pl-9 pr-2 text-left text-sm text-muted-foreground/70 hover:border-border-strong focus-visible:outline-none focus-visible:border-blue focus-visible:ring-3 focus-visible:ring-blue/15 transition-all cursor-pointer md:ml-0"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <span className="flex-1 truncate">Search students, companies, skills...</span>
        <kbd className="hidden shrink-0 rounded border border-border-strong bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:block">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setAiCopilotOpen(true)}
          className="hidden items-center gap-1.5 rounded-full bg-navy px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-navy-2 active:scale-95 transition-all cursor-pointer group"
        >
          <Sparkles className="h-3.5 w-3.5 text-sky group-hover:rotate-12 transition-transform" />
          Ask SkillDex
        </button>
        <button
          onClick={() => setAiCopilotOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-muted-foreground hover:bg-surface-muted active:scale-95 transition-transform sm:hidden cursor-pointer"
          aria-label="Ask SkillDex"
        >
          <Sparkles className="h-4.5 w-4.5" />
        </button>
        <button className="hidden h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-muted-foreground hover:bg-surface-muted sm:flex cursor-pointer" aria-label="Help">
          <HelpCircle className="h-4.5 w-4.5" />
        </button>
        <NotificationTray portal={portal} />

        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            onBlur={() => setTimeout(() => setProfileOpen(false), 150)}
            className="flex items-center gap-2 rounded-[var(--radius-md)] py-1 pl-1 pr-2 hover:bg-surface-muted cursor-pointer"
          >
            <Avatar name={userName} color={userColor} size={32} />
            <div className="hidden text-left leading-tight md:block">
              <p className="text-xs font-semibold text-foreground">{userName}</p>
              <p className="text-[10px] text-muted-foreground">{userRole}</p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-[var(--radius-md)] border border-border bg-surface py-1.5 shadow-[var(--shadow-lg)]">
              <MenuLink icon={UserRound} label="Profile" />
              <MenuLink icon={Settings} label="Preferences" />
              <MenuLink icon={Bell} label="Notifications" href={notifHref} />
              <MenuLink icon={HelpCircle} label="Help" />
              <div className="my-1 border-t border-border" />
              <MenuLink icon={ArrowLeftRight} label="Switch Portal" href="/" />
              <MenuLink icon={LogOut} label="Sign Out" href="/" />
            </div>
          )}
        </div>
      </div>

      <Drawer open={mobileOpen} onOpenChange={setMobileOpen} title="Navigation" side="left" width={280}>
        <SidebarContent portal={portal} collapsed={false} onNavigate={() => setMobileOpen(false)} />
      </Drawer>
    </header>
  );
}

function MenuLink({ icon: Icon, label, href = "#" }: { icon: typeof UserRound; label: string; href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-surface-muted">
      <Icon className="h-4 w-4 text-muted-foreground" />
      {label}
    </Link>
  );
}
