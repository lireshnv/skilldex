"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { faculty } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { HandCoins, Mic } from "lucide-react";

export default function CompanyFacultyPage() {
  const pushToast = useSkillDexStore((s) => s.pushToast);
  return (
    <PortalShell portal="company" userName="Innovate Labs" userColor="#059669" userRole="Industry Partnerships" breadcrumbs={[{ label: "Industry", href: "/industry/company" }, { label: "Faculty Network" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Faculty Network</h1>
        <p className="text-sm text-muted-foreground">Connect with faculty for consultancy, research and guest lectures.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {faculty.map((f) => (
          <Card key={f.id} className="p-4">
            <div className="flex items-center gap-3">
              <Avatar name={f.name} color={f.avatarColor} size={44} />
              <div>
                <p className="text-sm font-semibold text-foreground">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.title} · {f.college}</p>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">{f.expertise.map((e) => <Badge key={e} variant="outline">{e}</Badge>)}</div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => pushToast({ title: "Consultancy request sent", description: f.name })}><HandCoins className="h-3.5 w-3.5" /> Consultancy</Button>
              <Button size="sm" variant="primary" onClick={() => pushToast({ title: "Guest lecture invitation sent", description: f.name, variant: "success" })}><Mic className="h-3.5 w-3.5" /> Invite</Button>
            </div>
          </Card>
        ))}
      </div>
    </PortalShell>
  );
}
