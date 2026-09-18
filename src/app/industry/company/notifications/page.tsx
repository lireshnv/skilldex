"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { notificationsFor } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = { info: Info, success: CheckCircle2, warning: AlertTriangle };
const colorMap = { info: "text-blue-2 bg-blue-light", success: "text-emerald bg-emerald-light", warning: "text-amber bg-amber-light" };

export default function CompanyNotificationsPage() {
  const list = notificationsFor("company");
  const readNotifications = useSkillDexStore((s) => s.readNotifications);
  const markNotificationRead = useSkillDexStore((s) => s.markNotificationRead);
  const markAllRead = useSkillDexStore((s) => s.markAllRead);

  return (
    <PortalShell
      portal="company"
      userName="Innovate Labs"
      userColor="#059669"
      userRole="Industry Partnerships"
      breadcrumbs={[{ label: "Industry", href: "/industry/company" }, { label: "Notifications" }]}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">College matches, collaboration milestones and opportunity activity.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => markAllRead(list.map((n) => n.id))}>
          <CheckCheck className="h-4 w-4" /> Mark all read
        </Button>
      </div>
      {list.length === 0 ? (
        <EmptyState icon={Bell} title="You're all caught up" description="No new notifications right now." />
      ) : (
        <div className="space-y-2.5">
          {list.map((n) => {
            const read = readNotifications.includes(n.id);
            const Icon = iconMap[n.kind];
            return (
              <Card key={n.id} className={cn("flex items-start gap-3 p-4 cursor-pointer", !read && "border-blue/30 bg-blue-light/20")} onClick={() => markNotificationRead(n.id)}>
                <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", colorMap[n.kind])}><Icon className="h-4 w-4" /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
                </div>
                {!read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue" />}
              </Card>
            );
          })}
        </div>
      )}
    </PortalShell>
  );
}
