"use client";
import { useState } from "react";
import { FolderKanban, Plus, ShieldCheck } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { projectsByStudent, currentStudent, skillName } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";

export default function ProjectsPage() {
  const [open, setOpen] = useState(false);
  const projects = projectsByStudent(currentStudent.id);
  const pushToast = useSkillDexStore((s) => s.pushToast);

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Projects" }]}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Projects</h1>
          <p className="text-sm text-muted-foreground">Projects become verified evidence in your Skill Passport.</p>
        </div>
        <Button variant="primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add Project</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <Card key={p.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] bg-violet-light text-violet">
                <FolderKanban className="h-4.5 w-4.5" />
              </div>
              {p.verified && <Badge variant="emerald"><ShieldCheck className="h-3 w-3" /> Verified</Badge>}
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">{p.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {p.skills.map((s) => <Badge key={s} variant="outline">{skillName(s)}</Badge>)}
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen} title="Add a Project" description="Add project details — SkillDex will match it to relevant skills.">
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setOpen(false);
            pushToast({ title: "Project submitted for verification", description: "It will appear in your Skill Passport shortly.", variant: "success" });
          }}
        >
          <Input placeholder="Project title" required />
          <Textarea placeholder="Brief description" required />
          <Input placeholder="Skills used (comma separated)" />
          <Button type="submit" variant="primary" className="w-full">Submit Project</Button>
        </form>
      </Dialog>
    </PortalShell>
  );
}
