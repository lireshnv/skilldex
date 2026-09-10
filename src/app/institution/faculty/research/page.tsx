"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { FacultyOpportunityBoard } from "@/components/faculty-opportunity-board";
import { currentFaculty } from "@/lib/data";

export default function ResearchPage() {
  return (
    <PortalShell
      portal="faculty"
      userName={currentFaculty.name}
      userColor={currentFaculty.avatarColor}
      userRole={`${currentFaculty.title} · ${currentFaculty.department}`}
      breadcrumbs={[{ label: "Faculty", href: "/institution/faculty" }, { label: "Research" }]}
    >
      <FacultyOpportunityBoard types={["Research"]} title="Research Collaborations" subtitle="Joint research opportunities with industry R&D teams." />
    </PortalShell>
  );
}
