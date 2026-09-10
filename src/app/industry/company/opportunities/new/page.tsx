"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Users, Briefcase, FlaskConical, Trophy, GraduationCap, HandCoins, FileStack } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { useSkillDexStore } from "@/lib/store";

const opportunityTypes = [
  { id: "Full-time", label: "Job", icon: Briefcase },
  { id: "Internship", label: "Internship", icon: Briefcase },
  { id: "Live Project", label: "Live Project", icon: FlaskConical },
  { id: "Hackathon", label: "Hackathon", icon: Trophy },
  { id: "Workshop", label: "Workshop", icon: GraduationCap },
  { id: "Mentorship", label: "Mentorship", icon: Users },
  { id: "Research", label: "Research", icon: FlaskConical },
  { id: "Consultancy", label: "Consultancy", icon: HandCoins },
];

export default function NewOpportunityPage() {
  const router = useRouter();
  const pushToast = useSkillDexStore((s) => s.pushToast);
  const [type, setType] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [published, setPublished] = useState(false);

  return (
    <PortalShell portal="company" userName="Innovate Labs" userColor="#059669" userRole="Industry Partnerships" breadcrumbs={[{ label: "Industry", href: "/industry/company" }, { label: "Opportunities", href: "/industry/company/opportunities" }, { label: "New" }]}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Post an Opportunity</h1>
        <p className="text-sm text-muted-foreground">Choose an opportunity type to get started.</p>
      </div>

      {!type ? (
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {opportunityTypes.map((t) => (
            <button key={t.id} onClick={() => setType(t.id)} className="cursor-pointer">
              <Card className="flex flex-col items-center gap-2 p-5 text-center hover:border-blue/30 hover:shadow-[var(--shadow-md)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-blue-light text-blue-2"><t.icon className="h-5 w-5" /></div>
                <p className="text-sm font-medium text-foreground">{t.label}</p>
              </Card>
            </button>
          ))}
        </div>
      ) : (
        <Card className="mx-auto max-w-xl">
          <CardContent className="space-y-4 p-6">
            {!published ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">{opportunityTypes.find((o) => o.id === type)?.label} Details</p>
                  <Button variant="ghost" size="sm" onClick={() => setType(null)}>Change Type</Button>
                </div>
                {step === 0 && (
                  <div className="space-y-3">
                    <Input placeholder="Title" defaultValue={`${opportunityTypes.find((o) => o.id === type)?.label} with Innovate Labs`} />
                    <Textarea placeholder="Description" defaultValue="Join us on an exciting engagement that connects academic learning with real industry impact." />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Location" defaultValue="Remote / Hybrid" />
                      <Input placeholder="Duration" defaultValue="8 weeks" />
                    </div>
                    <Select defaultValue="All Departments">
                      <option>All Departments</option>
                      <option>CSE Only</option>
                      <option>CSE + IT + AI & DS</option>
                    </Select>
                  </div>
                )}
                {step === 1 && (
                  <div className="space-y-3 text-center">
                    <Sparkles className="mx-auto h-7 w-7 text-blue-2" />
                    <p className="text-sm text-muted-foreground">Ready to publish this opportunity to matched colleges and students.</p>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-4">
                  {step > 0 ? <Button variant="outline" size="sm" onClick={() => setStep(0)}>Back</Button> : <span />}
                  {step === 0 ? (
                    <Button variant="primary" size="sm" onClick={() => setStep(1)}>Review</Button>
                  ) : (
                    <Button variant="primary" size="sm" onClick={() => { setPublished(true); pushToast({ title: "Opportunity published", variant: "success" }); }}>Publish</Button>
                  )}
                </div>
              </>
            ) : (
              <div className="space-y-3 text-center">
                <Check className="mx-auto h-10 w-10 rounded-full bg-emerald-light p-2 text-emerald" />
                <p className="text-sm font-semibold text-foreground">Opportunity published successfully!</p>
                <Button variant="outline" onClick={() => router.push("/industry/company/opportunities")}><FileStack className="h-4 w-4" /> View Opportunities</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </PortalShell>
  );
}
