"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { FacultyOpportunityBoard } from "@/components/faculty-opportunity-board";
import { currentFaculty } from "@/lib/data";

export default function ConsultancyPage() {
  return (
    <PortalShell
      portal="faculty"
      userName={currentFaculty.name}
      userColor={currentFaculty.avatarColor}
      userRole={`${currentFaculty.title} · ${currentFaculty.department}`}
      breadcrumbs={[{ label: "Faculty", href: "/institution/faculty" }, { label: "Consultancy" }]}
    >
      <FacultyOpportunityBoard types={["Consultancy"]} title="Consultancy Engagements" subtitle="Paid advisory engagements matched to your domain expertise." />
    </PortalShell>
  );
}
