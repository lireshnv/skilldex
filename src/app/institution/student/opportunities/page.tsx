"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OpportunityBoard } from "@/components/opportunity-board";
import { currentStudent } from "@/lib/data";

export default function StudentOpportunitiesPage() {
  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Opportunities" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Opportunities</h1>
        <p className="text-sm text-muted-foreground">Jobs, internships and live projects matched to your skill profile.</p>
      </div>

      <Tabs defaultValue="jobs">
        <TabsList className="mb-6">
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="internships">Internships & Live Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <OpportunityBoard showHeader={false} types={["Full-time"]} title="Jobs" subtitle="Full-time roles matched to your skill profile." />
        </TabsContent>

        <TabsContent value="internships">
          <OpportunityBoard showHeader={false} types={["Internship", "Live Project"]} title="Internships & Live Projects" subtitle="Hands-on opportunities to build real-world evidence." />
        </TabsContent>
      </Tabs>
    </PortalShell>
  );
}
