"use client";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { currentStudent } from "@/lib/data";
import { Video, Lightbulb } from "lucide-react";
import Link from "next/link";

const technicalQs = [
  "Explain the difference between an array and a linked list.",
  "What is the time complexity of merge sort and why?",
  "How would you design a URL shortening service?",
  "Explain normalization in databases with an example.",
  "What is the difference between REST and GraphQL?",
];
const behavioralQs = [
  "Tell me about a time you faced a conflict in a team project.",
  "Describe a challenging bug you fixed and how you approached it.",
  "Why do you want to work at this company?",
  "Tell me about a project you're most proud of.",
  "How do you handle tight deadlines?",
];

export default function InterviewPrepPage() {
  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Interview Preparation" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Interview Preparation</h1>
        <p className="text-sm text-muted-foreground">Practice technical and behavioral questions tailored to your target role.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="technical">
            <TabsList>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
            </TabsList>
            <TabsContent value="technical" className="mt-4 space-y-2.5">
              {technicalQs.map((q, i) => (
                <Card key={i} className="p-4 text-sm text-foreground">{i + 1}. {q}</Card>
              ))}
            </TabsContent>
            <TabsContent value="behavioral" className="mt-4 space-y-2.5">
              {behavioralQs.map((q, i) => (
                <Card key={i} className="p-4 text-sm text-foreground">{i + 1}. {q}</Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-1.5"><Video className="h-4 w-4 text-blue-2" /> Mock Interview</CardTitle></CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Practice live with an AI interviewer or book a session with an alumni mentor.</p>
              <Link href="/institution/student/mock-interview">
                <Button variant="primary" size="sm" className="mt-3 w-full">Start Mock Interview</Button>
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-1.5"><Lightbulb className="h-4 w-4 text-amber" /> Tips</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>• Structure answers using the STAR method for behavioral questions.</p>
              <p>• Think aloud during technical questions — interviewers value process.</p>
              <p>• Always clarify requirements before diving into a solution.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
