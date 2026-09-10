"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { OpportunityBoard } from "@/components/opportunity-board";
import { currentStudent } from "@/lib/data";

export default function InternshipsPage() {
  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Internships" }]}
    >
      <OpportunityBoard types={["Internship", "Live Project"]} title="Internships & Live Projects" subtitle="Hands-on opportunities to build real-world evidence." />
    </PortalShell>
  );
}
