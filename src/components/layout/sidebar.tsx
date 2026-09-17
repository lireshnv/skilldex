"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, Compass, ArrowLeftRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavItem, PortalKey, portalMeta } from "@/lib/nav-config";
import { useSkillDexStore } from "@/lib/store";
import Link2 from "next/link";

function NavLink({ item, collapsed, onNavigate }: { item: NavItem; collapsed: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href;
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "group relative flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-all duration-150 select-none",
        active
          ? "bg-blue-light text-blue-2 font-semibold shadow-2xs"
          : "text-muted-foreground hover:bg-surface-muted hover:text-foreground",
        collapsed && "justify-center px-2"
      )}
      title={collapsed ? item.label : undefined}
    >
      {active && !collapsed && (
        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-blue" />
      )}
      <Icon className={cn("h-4.5 w-4.5 shrink-0 transition-transform duration-150 group-hover:scale-105", active && "text-blue-2")} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

export function SidebarContent({ portal, collapsed, onNavigate }: { portal: PortalKey; collapsed: boolean; onNavigate?: () => void }) {
  const meta = portalMeta[portal];
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

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-4">
        {meta.nav.map((item) => (
          <NavLink key={item.href} item={item} collapsed={collapsed} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="space-y-1 border-t border-border p-2">
        <Link2
          href={meta.switchHref}
          className={cn(
            "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <Compass className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>Switch Workspace</span>}
        </Link2>
        <Link2
          href="/"
          className={cn(
            "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-surface-muted hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          <ArrowLeftRight className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>Switch Portal</span>}
        </Link2>
      </div>
    </div>
  );
}

export function DesktopSidebar({ portal }: { portal: PortalKey }) {
  const collapsed = useSkillDexStore((s) => s.sidebarCollapsed);
  const setCollapsed = useSkillDexStore((s) => s.setSidebarCollapsed);
  return (
    <aside
      className={cn(
        "relative hidden shrink-0 border-r border-border bg-surface transition-all duration-200 lg:flex lg:flex-col",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      <SidebarContent portal={portal} collapsed={collapsed} />
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
