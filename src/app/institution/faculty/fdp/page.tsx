"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { FacultyOpportunityBoard } from "@/components/faculty-opportunity-board";
import { currentFaculty } from "@/lib/data";

export default function FdpPage() {
  return (
    <PortalShell
      portal="faculty"
      userName={currentFaculty.name}
      userColor={currentFaculty.avatarColor}
      userRole={`${currentFaculty.title} · ${currentFaculty.department}`}
      breadcrumbs={[{ label: "Faculty", href: "/institution/faculty" }, { label: "FDP Opportunities" }]}
    >
      <FacultyOpportunityBoard types={["Workshop"]} title="Faculty Development Programs" subtitle="FDPs and bootcamps matched to your expertise areas." />
    </PortalShell>
  );
}
