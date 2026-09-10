"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { OpportunityBoard } from "@/components/opportunity-board";
import { currentStudent } from "@/lib/data";

export default function JobsPage() {
  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Jobs" }]}
    >
      <OpportunityBoard types={["Full-time"]} title="Jobs" subtitle="Full-time roles matched to your skill profile." />
    </PortalShell>
  );
}
