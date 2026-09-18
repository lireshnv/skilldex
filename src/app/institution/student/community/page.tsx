"use client";
import { useMemo, useState } from "react";
import { Search, MessageCircleQuestion, UserPlus, Handshake, ShieldCheck, Flame, Trophy, Medal, Award } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/ui/kpi-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { RevealOnView } from "@/components/motion/reveal-on-view";
import { alumni, currentStudent, leaderboard, studentPoints } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Student } from "@/lib/types";

const forumTopics = [
  { title: "Interview experiences at product companies", replies: 34, tag: "Interviews" },
  { title: "How I prepared for TCS NQT in 6 weeks", replies: 21, tag: "Preparation" },
  { title: "Transitioning from service to product roles", replies: 18, tag: "Career" },
  { title: "Resume review requests — post here!", replies: 56, tag: "Resume" },
  { title: "System design questions I faced at Flipkart", replies: 12, tag: "Technical" },
];

const rankStyles: Record<number, string> = {
  1: "bg-amber-light text-amber",
  2: "bg-surface-muted text-muted-foreground",
  3: "bg-rose-light text-rose",
};
const rankIcons: Record<number, typeof Trophy> = { 1: Trophy, 2: Medal, 3: Award };

export default function StudentCommunityPage() {
  const [query, setQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("All Companies");
  const connections = useSkillDexStore((s) => s.connections);
  const toggleConnection = useSkillDexStore((s) => s.toggleConnection);
  const pushToast = useSkillDexStore((s) => s.pushToast);
  const streak = useSkillDexStore((s) => s.streak);
  const longestStreak = useSkillDexStore((s) => s.longestStreak);

  const companyOptions = ["All Companies", ...Array.from(new Set(alumni.map((a) => a.company)))];
  const filtered = useMemo(() => {
    return alumni
      .filter((a) => a.name.toLowerCase().includes(query.toLowerCase()) || a.company.toLowerCase().includes(query.toLowerCase()))
      .filter((a) => companyFilter === "All Companies" || a.company === companyFilter);
  }, [query, companyFilter]);

  const ranked = leaderboard();
  const myRank = ranked.findIndex((s) => s.id === currentStudent.id) + 1;

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Community" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Community</h1>
        <p className="text-sm text-muted-foreground">Alumni, mentors, forums, and where you rank.</p>
      </div>

      <Tabs defaultValue="alumni">
        <TabsList className="mb-6">
          <TabsTrigger value="alumni">Alumni & Mentors</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* ---------- ALUMNI ---------- */}
        <TabsContent value="alumni">
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
        </TabsContent>

        {/* ---------- LEADERBOARD ---------- */}
        <TabsContent value="leaderboard">
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <KpiCard label="Current Streak" value={streak} suffix={streak === 1 ? " day" : " days"} icon={Flame} trendLabel="keep it going" />
            <KpiCard label="Longest Streak" value={longestStreak} suffix={longestStreak === 1 ? " day" : " days"} icon={Trophy} trendLabel="personal best" />
            <KpiCard label="Your Rank" value={`#${myRank}`} suffix={` of ${ranked.length}`} icon={Medal} trendLabel="verified progress" />
          </div>

          <Card>
            <CardHeader><CardTitle>Top Students</CardTitle></CardHeader>
            <CardContent>
              <StaggerGrid className="space-y-2">
                {ranked.slice(0, 15).map((s, i) => (
                  <StaggerItem key={s.id}>
                    <LeaderboardRow student={s} rank={i + 1} isMe={s.id === currentStudent.id} />
                  </StaggerItem>
                ))}
              </StaggerGrid>

              {myRank > 15 && (
                <RevealOnView>
                  <div className="my-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-px flex-1 bg-border" /> your position <div className="h-px flex-1 bg-border" />
                  </div>
                  <LeaderboardRow student={currentStudent} rank={myRank} isMe />
                </RevealOnView>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PortalShell>
  );
}

function LeaderboardRow({ student: s, rank, isMe }: { student: Student; rank: number; isMe: boolean }) {
  const RankIcon = rankIcons[rank];
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-md)] border p-3",
        isMe ? "border-blue/40 bg-blue-light/30" : "border-border"
      )}
    >
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold", rankStyles[rank] ?? "bg-surface-muted text-muted-foreground")}>
        {RankIcon ? <RankIcon className="h-4 w-4" /> : rank}
      </div>
      <Avatar name={s.name} color={s.avatarColor} size={36} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
          {s.name} {isMe && <Badge variant="blue">You</Badge>}
        </p>
        <p className="truncate text-xs text-muted-foreground">{s.college}</p>
      </div>
      <p className="text-sm font-bold text-foreground">{studentPoints(s).toLocaleString()} <span className="text-xs font-medium text-muted-foreground">pts</span></p>
    </div>
  );
}
