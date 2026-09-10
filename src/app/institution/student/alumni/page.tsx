"use client";
import { useMemo, useState } from "react";
import { Search, MessageCircleQuestion, UserPlus, Handshake, ShieldCheck } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { alumni, currentStudent } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";

const forumTopics = [
  { title: "Interview experiences at product companies", replies: 34, tag: "Interviews" },
  { title: "How I prepared for TCS NQT in 6 weeks", replies: 21, tag: "Preparation" },
  { title: "Transitioning from service to product roles", replies: 18, tag: "Career" },
  { title: "Resume review requests — post here!", replies: 56, tag: "Resume" },
  { title: "System design questions I faced at Flipkart", replies: 12, tag: "Technical" },
];

export default function AlumniPage() {
  const [query, setQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All Companies");
  const connections = useSkillDexStore((s) => s.connections);
  const toggleConnection = useSkillDexStore((s) => s.toggleConnection);
  const pushToast = useSkillDexStore((s) => s.pushToast);

  const companyOptions = ["All Companies", ...Array.from(new Set(alumni.map((a) => a.company)))];

  const filtered = useMemo(() => {
    return alumni
      .filter((a) => a.name.toLowerCase().includes(query.toLowerCase()) || a.company.toLowerCase().includes(query.toLowerCase()))
      .filter((a) => companyFilter === "All Companies" || a.company === companyFilter);
  }, [query, companyFilter]);

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Alumni & Mentors" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Alumni & Senior Connect</h1>
        <p className="text-sm text-muted-foreground">Learn from alumni who&apos;ve walked the path before you.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search alumni by name or company..." className="pl-9" />
            </div>
            <Select value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)} className="sm:w-48">
              {companyOptions.map((c) => <option key={c}>{c}</option>)}
            </Select>
          </div>

          <div className="space-y-3">
            {filtered.map((a) => {
              const connected = connections.includes(a.id);
              return (
                <Card key={a.id} className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={a.name} color={a.avatarColor} size={44} />
                      <div>
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">{a.name} <ShieldCheck className="h-3.5 w-3.5 text-emerald" /></p>
                        <p className="text-xs text-muted-foreground">{a.role} at {a.company} · {a.experience} yrs exp · Class of {a.gradYear}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {a.expertise.map((e) => <Badge key={e} variant="outline">{e}</Badge>)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => pushToast({ title: "Question sent", description: `Your question was sent to ${a.name}.` })}>
                        <MessageCircleQuestion className="h-3.5 w-3.5" /> Ask
                      </Button>
                      <Button
                        size="sm"
                        variant={connected ? "subtle" : "primary"}
                        onClick={() => { toggleConnection(a.id); pushToast({ title: connected ? "Connection removed" : "Connection request sent", description: a.name, variant: "success" }); }}
                      >
                        <UserPlus className="h-3.5 w-3.5" /> {connected ? "Requested" : "Connect"}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="h-fit">
          <CardHeader><CardTitle className="flex items-center gap-1.5"><Handshake className="h-4 w-4 text-blue-2" /> Community Forum</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {forumTopics.map((t) => (
              <div key={t.title} className="rounded-[var(--radius-md)] border border-border p-3">
                <Badge variant="blue" className="mb-1.5">{t.tag}</Badge>
                <p className="text-sm font-medium text-foreground">{t.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t.replies} replies</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
