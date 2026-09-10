"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { FacultyOpportunityBoard } from "@/components/faculty-opportunity-board";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { currentFaculty, students } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";

const requests = students.slice(2, 6);

export default function MentorshipPage() {
  const pushToast = useSkillDexStore((s) => s.pushToast);
  return (
    <PortalShell
      portal="faculty"
      userName={currentFaculty.name}
      userColor={currentFaculty.avatarColor}
      userRole={`${currentFaculty.title} · ${currentFaculty.department}`}
      breadcrumbs={[{ label: "Faculty", href: "/institution/faculty" }, { label: "Mentorship" }]}
    >
      <Card className="mb-6">
        <CardHeader><CardTitle>Student Mentorship Requests</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {requests.map((s) => (
            <div key={s.id} className="flex items-center justify-between rounded-[var(--radius-md)] border border-border p-3">
              <div className="flex items-center gap-3">
                <Avatar name={s.name} color={s.avatarColor} size={40} />
                <div>
                  <p className="text-sm font-semibold text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.department} · Interested in {s.targetRole}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">Pending</Badge>
                <Button size="sm" variant="primary" onClick={() => pushToast({ title: "Mentorship accepted", description: s.name, variant: "success" })}>Accept</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <FacultyOpportunityBoard types={["Mentorship"]} title="Industry Mentorship Programs" subtitle="Structured mentorship programs with industry professionals." />
    </PortalShell>
  );
}
