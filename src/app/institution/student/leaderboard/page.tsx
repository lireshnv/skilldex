"use client";
import { Flame, Trophy, Medal, Award } from "lucide-react";
import { PortalShell } from "@/components/layout/portal-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { StaggerGrid, StaggerItem } from "@/components/motion/stagger-grid";
import { RevealOnView } from "@/components/motion/reveal-on-view";
import { currentStudent, leaderboard, studentPoints } from "@/lib/data";
import { useSkillDexStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { Student } from "@/lib/types";

const rankStyles: Record<number, string> = {
  1: "bg-amber-light text-amber",
  2: "bg-surface-muted text-muted-foreground",
  3: "bg-rose-light text-rose",
};
const rankIcons: Record<number, typeof Trophy> = { 1: Trophy, 2: Medal, 3: Award };

export default function LeaderboardPage() {
  const streak = useSkillDexStore((s) => s.streak);
  const longestStreak = useSkillDexStore((s) => s.longestStreak);
  const ranked = leaderboard();
  const myRank = ranked.findIndex((s) => s.id === currentStudent.id) + 1;

  return (
    <PortalShell
      portal="student"
      userName={currentStudent.name}
      userColor={currentStudent.avatarColor}
      userRole={`${currentStudent.department} · Year ${currentStudent.year}`}
      breadcrumbs={[{ label: "Student", href: "/institution/student" }, { label: "Leaderboard" }]}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-sm text-muted-foreground">Ranked by verified skill progress, projects and outcomes.</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-amber-light text-amber">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">{streak} <span className="text-sm font-medium text-muted-foreground">day{streak === 1 ? "" : "s"}</span></p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-blue-light text-blue-2">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Longest Streak</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">{longestStreak} <span className="text-sm font-medium text-muted-foreground">day{longestStreak === 1 ? "" : "s"}</span></p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-emerald-light text-emerald">
              <Medal className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Your Rank</p>
              <p className="text-2xl font-bold tracking-tight text-foreground">#{myRank} <span className="text-sm font-medium text-muted-foreground">of {ranked.length}</span></p>
            </div>
          </div>
        </Card>
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
