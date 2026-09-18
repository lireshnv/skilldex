"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { notificationsFor } from "@/lib/data";
import { useSkillDexStore, useUnreadCount } from "@/lib/store";
import { PortalKey } from "@/lib/nav-config";
import { cn } from "@/lib/utils";

const audienceMap: Record<PortalKey, "student" | "faculty" | "placement" | "recruiter" | "company"> = {
  student: "student", faculty: "faculty", placement: "placement", recruiter: "recruiter", company: "company",
};

const iconMap = { info: Info, success: CheckCircle2, warning: AlertTriangle };
const colorMap = { info: "text-blue-2 bg-blue-light", success: "text-emerald bg-emerald-light", warning: "text-amber bg-amber-light" };

const notifHrefFor: Record<PortalKey, string> = {
  student: "/institution/student/notifications",
  faculty: "/institution/faculty/notifications",
  placement: "/institution/placement/notifications",
  recruiter: "/industry/recruiter/notifications",
  company: "/industry/company/notifications",
};

// A quick-glance dropdown tray off the header bell, instead of forcing a
// full page navigation just to see what's new — one of the few surfaces
// that earns glassmorphism (floating overlay above live content).
export function NotificationTray({ portal }: { portal: PortalKey }) {
  const [open, setOpen] = useState(false);
  const audience = audienceMap[portal];
  const list = notificationsFor(audience).slice(0, 6);
  const readNotifications = useSkillDexStore((s) => s.readNotifications);
  const markNotificationRead = useSkillDexStore((s) => s.markNotificationRead);
  const markAllRead = useSkillDexStore((s) => s.markAllRead);
  const unread = useUnreadCount(audience);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="relative flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-muted-foreground hover:bg-surface-muted"
        aria-label="Notifications"
      >
        <Bell className="h-4.5 w-4.5" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose text-[9px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Notifications</p>
              {unread > 0 && (
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => markAllRead(list.map((n) => n.id))}
                  className="flex items-center gap-1 text-[11px] font-medium text-blue-2 hover:underline cursor-pointer"
                >
                  <CheckCheck className="h-3 w-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {list.length === 0 ? (
                <p className="px-4 py-6 text-center text-xs text-muted-foreground">You&apos;re all caught up.</p>
              ) : (
                list.map((n) => {
                  const read = readNotifications.includes(n.id);
                  const Icon = iconMap[n.kind];
                  return (
                    <button
                      key={n.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => markNotificationRead(n.id)}
                      className={cn(
                        "flex w-full items-start gap-2.5 border-b border-border/60 px-4 py-3 text-left last:border-b-0 hover:bg-surface-muted cursor-pointer",
                        !read && "bg-blue-light/10"
                      )}
                    >
                      <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", colorMap[n.kind])}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">{n.title}</p>
                        <p className="line-clamp-2 text-[11px] text-muted-foreground">{n.body}</p>
                        <p className="mt-0.5 text-[10px] text-muted-foreground">{n.time}</p>
                      </div>
                      {!read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />}
                    </button>
                  );
                })
              )}
            </div>

            <Link
              href={notifHrefFor[portal]}
              onMouseDown={(e) => e.preventDefault()}
              className="block border-t border-border px-4 py-2.5 text-center text-xs font-medium text-blue-2 hover:bg-surface-muted"
            >
              View all notifications
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
