"use client";
import "../styles/landing.css";
import Link from "next/link";
import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, GraduationCap, Building2, Users, TrendingUp, UserSearch,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useSkillDexStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { LandingNav } from "@/components/landing/landing-nav";
import { HeroNetwork } from "@/components/landing/hero-network";
import { IntelligenceLoop } from "@/components/landing/intelligence-loop";
import { SkillGraphMini } from "@/components/landing/skill-graph-mini";
import { Ecosystems } from "@/components/landing/ecosystems";
import { FlowChain } from "@/components/landing/flow-chain";
import { MagneticButton } from "@/components/landing/magnetic-button";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/reveal";
import { revealUp } from "@/lib/landing-motion";

const questions = [
  { who: "Student", q: "What skills do I have — and what am I missing?" },
  { who: "Institution", q: "Are our students developing the skills industry actually needs?" },
  { who: "Industry", q: "Where can we find people with the capabilities we need?" },
];

const missingLinks = ["STUDENT", "SKILLS", "EVIDENCE", "INSTITUTION", "INDUSTRY REQUIREMENTS", "OPPORTUNITY", "OUTCOME"];

const evolveSteps = [
  "Current Skills", "Skill Assessment", "Skill Gap", "Learning Path",
  "Project / Experience", "Verified Evidence", "Opportunity", "Career Outcome",
];

const audiences = [
  {
    id: "student", icon: GraduationCap, title: "Students", tag: "Know where you stand.",
    desc: "Understand your current capabilities, discover hidden skills, identify gaps and see what to build next.",
    caps: ["Skill Passport", "Skill Gap Analysis", "Personalized Development Path", "Career & Company Intelligence", "Opportunity Matching"],
  },
  {
    id: "institution", icon: Building2, title: "Institutions", tag: "Know where your talent stands.",
    desc: "Understand student readiness, identify curriculum and skill gaps, track development and strengthen industry connections.",
    caps: ["Skill Readiness", "Department Analytics", "Placement Intelligence", "Industry Requirements", "Resource & Company Intelligence"],
  },
  {
    id: "industry", icon: UserSearch, title: "Industry", tag: "Find capability beyond resumes.",
    desc: "Discover relevant talent and institutions through verified skills, projects, activity and evidence.",
    caps: ["Talent Discovery", "Skill-Based Matching", "College Discovery", "Project & Internship Pipelines", "Hiring & Collaboration"],
  },
];

const hiddenChain = ["Hackathon", "Problem Solving", "Team Leadership", "Product Thinking", "Communication"];

function DemoDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const setDemoRole = useSkillDexStore((s) => s.setDemoRole);
  const options = [
    { role: "student" as const, label: "Student Demo", desc: "Explore skill passport, assessments and career tools.", href: "/institution/student", icon: GraduationCap },
    { role: "faculty" as const, label: "Faculty Demo", desc: "Explore expertise mapping and industry opportunities.", href: "/institution/faculty", icon: Users },
    { role: "placement" as const, label: "Placement Cell Demo", desc: "Explore the placement intelligence command center.", href: "/institution/placement", icon: TrendingUp },
    { role: "recruiter" as const, label: "Recruiter Demo", desc: "Explore talent discovery and hiring pipelines.", href: "/industry/recruiter", icon: UserSearch },
    { role: "company" as const, label: "Industry Demo", desc: "Explore college discovery and collaboration tools.", href: "/industry/company", icon: Building2 },
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Explore SkillDex Demo" description="Jump straight into any workspace — no login required.">
      <div className="mt-2 grid gap-2">
        {options.map((o) => (
          <button
            key={o.role}
            onClick={() => {
              setDemoRole(o.role);
              onOpenChange(false);
              router.push(o.href);
            }}
            className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border p-3 text-left hover:border-blue hover:bg-blue-light/40 cursor-pointer transition-colors"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-blue-light text-blue-2">
              <o.icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{o.label}</p>
              <p className="text-xs text-muted-foreground">{o.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </Dialog>
  );
}

export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="sd-landing relative min-h-screen">
      <LandingNav onExplore={() => setDemoOpen(true)} />

      {/* ============ HERO ============ */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
        <div className="sd-grid pointer-events-none absolute inset-0" />
        <div className="sd-grain" />
        <div className="sd-network-mask pointer-events-none absolute inset-0 opacity-60">
          <HeroNetwork />
        </div>

        <motion.div initial="hidden" animate="show" variants={revealUp} className="relative z-10 flex flex-col items-center text-center">
          <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--sd-text-faint)]">
            Skill Intelligence Platform
          </p>
          <h1 className="max-w-3xl text-[clamp(2.5rem,8vw,5.5rem)] font-semibold leading-[1.02] tracking-tight text-[var(--sd-text)]">
            Three ecosystems.
            <br />
            One connected skill network.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-[var(--sd-text-muted)] sm:text-lg">
            Students build skills. Institutions develop talent. Industry needs capability.
            <br className="hidden sm:block" />
            SkillDex brings people, skills, evidence and opportunity into one connected layer.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              onClick={() => setDemoOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform active:scale-95"
            >
              Explore SkillDex <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              onClick={() => document.getElementById("connects")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--sd-border-strong)] px-6 py-3 text-sm font-medium text-[var(--sd-text)] transition-colors hover:border-white/30"
            >
              See how it connects
            </MagneticButton>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 h-8 w-px bg-gradient-to-b from-transparent via-[var(--sd-border-strong)] to-transparent"
        />
      </section>

      {/* ============ THE DISCONNECTED ECOSYSTEM ============ */}
      <section className="border-t sd-divider px-4 py-28 sm:py-36">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text)]">
            The talent ecosystem is disconnected.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--sd-text-muted)]">
            Students learn without a clear view of what industry needs. Institutions manage skills, training and
            placements across disconnected systems. Industry searches for talent through resumes that rarely show
            the full picture.
          </p>
        </Reveal>

        <RevealGroup className="mx-auto mt-20 grid max-w-4xl gap-4 sm:grid-cols-3" stagger={0.12}>
          {questions.map((q) => (
            <RevealItem key={q.who} className="sd-glass rounded-2xl p-6">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--sd-text-faint)]">{q.who}</p>
              <p className="mt-3 text-sm italic leading-relaxed text-[var(--sd-text)]">&ldquo;{q.q}&rdquo;</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="mx-auto mt-16 max-w-md text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--sd-text-faint)]">The result</p>
          <p className="mt-3 text-lg font-medium leading-relaxed text-[var(--sd-text-muted)] sm:text-xl">
            Skills stay hidden. Gaps stay unnoticed. Opportunities stay disconnected.
          </p>
        </Reveal>
      </section>

      {/* ============ CONNECTS THE MISSING LINKS ============ */}
      <section id="connects" className="border-t sd-divider px-4 py-28 sm:py-36">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text)]">
            SkillDex connects the missing links.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--sd-text-muted)]">
            SkillDex continuously connects these signals to create a live view of capability and demand.
          </p>
        </Reveal>
        <FlowChain steps={missingLinks} loop />
      </section>

      {/* ============ SKILL GRAPH ============ */}
      <section className="border-t sd-divider px-4 py-28 sm:py-36">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--sd-text-faint)]">The Skill Intelligence Graph</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text)]">
              One skill. Multiple connections.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--sd-text-muted)]">
              A skill doesn&apos;t exist in isolation. SkillDex maps these relationships across skills, roles, projects,
              courses, certifications, companies and opportunities — hover Python to see where it leads.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="sd-glass rounded-2xl p-6">
              <SkillGraphMini />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ BEFORE / AFTER ============ */}
      <section className="border-t sd-divider px-4 py-28 sm:py-36">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text)]">
            From disconnected data to connected intelligence.
          </h2>
        </Reveal>

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
          <Reveal>
            <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--sd-text-faint)]">Before</p>
            <RevealGroup className="flex flex-col gap-3" stagger={0.1}>
              {[
                { title: "Student Profile", items: "Skills · Projects · Certificates" },
                { title: "College System", items: "Courses · Departments · Placements" },
                { title: "Industry", items: "Job Descriptions · Required Skills · Hiring Needs" },
              ].map((b) => (
                <RevealItem key={b.title} className="rounded-xl border border-[var(--sd-border)] p-5 opacity-70">
                  <p className="text-sm font-semibold text-[var(--sd-text)]">{b.title}</p>
                  <p className="mt-1 text-xs text-[var(--sd-text-faint)]">{b.items}</p>
                </RevealItem>
              ))}
            </RevealGroup>
            <p className="mt-4 text-center text-xs font-medium text-[var(--sd-text-faint)]">Disconnected.</p>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--sd-accent)]">After — SkillDex</p>
            <div className="sd-glass-strong flex flex-col items-center rounded-2xl p-8 text-center">
              <p className="text-sm font-semibold text-[var(--sd-text)]">Student → Skills</p>
              <div className="my-3 h-6 w-px bg-[var(--sd-border-strong)]" />
              <p className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-black">SkillDex — Skill Intelligence</p>
              <div className="my-3 flex gap-4 text-xs text-[var(--sd-text-muted)]">
                <span>Evidence</span><span>Role</span><span>Gap</span>
              </div>
              <div className="h-6 w-px bg-[var(--sd-border-strong)]" />
              <p className="mt-3 text-sm font-semibold text-[var(--sd-text)]">Opportunity → Outcome</p>
            </div>
            <p className="mt-4 text-center text-xs font-medium text-[var(--sd-accent)]">One connected view of the ecosystem.</p>
          </Reveal>
        </div>
      </section>

      {/* ============ EVIDENCE -> OPPORTUNITY ============ */}
      <section className="border-t sd-divider px-4 py-28 sm:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text)]">
              Don&apos;t just say you have a skill.
            </p>
            <p className="mt-1 text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-tight tracking-tight text-[var(--sd-accent)]">
              Show it.
            </p>
            <p className="mx-auto mt-5 max-w-md text-base text-[var(--sd-text-muted)]">
              SkillDex connects claims with evidence. The system matches opportunities using skills and evidence, not
              just resume keywords.
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mx-auto mt-16 flex max-w-3xl flex-col items-stretch gap-4 sm:flex-row sm:items-center" stagger={0.12}>
          <RevealItem className="sd-glass flex-1 rounded-2xl p-6 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--sd-text-faint)]">Evidence</p>
            <p className="mt-2 text-base font-semibold text-[var(--sd-text)]">Computer Vision Pipeline</p>
            <p className="mt-1 text-xs text-[var(--sd-text-muted)]">Python · OpenCV · PyTorch</p>
            <p className="mt-3 text-[11px] text-[var(--sd-text-faint)]">GitHub · Assessment · Project · Certification</p>
          </RevealItem>
          <RevealItem className="flex shrink-0 justify-center text-[var(--sd-text-faint)]">
            <ArrowRight className="h-5 w-5 rotate-90 sm:rotate-0" />
          </RevealItem>
          <RevealItem className="sd-glass-strong flex-1 rounded-2xl p-6 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--sd-accent)]">Verified Capability → Opportunity</p>
            <p className="mt-2 text-base font-semibold text-[var(--sd-text)]">ML Engineer Internship</p>
            <p className="mt-1 text-xs text-[var(--sd-text-muted)]">Matched on skills and evidence</p>
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ============ EVOLVING PROFILE ============ */}
      <section className="border-t sd-divider px-4 py-28 sm:py-36">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <p className="text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text)]">
            Skills shouldn&apos;t end at a profile.
          </p>
          <p className="mt-1 text-[clamp(1.5rem,3.5vw,2.25rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text-muted)]">
            They should lead somewhere.
          </p>
        </Reveal>
        <FlowChain steps={evolveSteps} dense />
        <Reveal delay={0.1} className="mx-auto mt-10 max-w-sm text-center">
          <p className="text-sm text-[var(--sd-text-muted)]">Every outcome can feed back into the skill model.</p>
          <p className="mt-1 text-sm font-medium text-[var(--sd-accent)]">The profile evolves as capability evolves.</p>
        </Reveal>
      </section>

      {/* ============ THREE ECOSYSTEMS CONVERGE ============ */}
      <Ecosystems />

      {/* ============ AUDIENCE ============ */}
      <section className="border-t sd-divider px-4 py-28 sm:py-36">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text)]">
            Built for three connected ecosystems.
          </h2>
        </Reveal>

        <RevealGroup className="mx-auto mt-16 grid max-w-5xl gap-4 lg:grid-cols-3" stagger={0.12}>
          {audiences.map((a) => (
            <RevealItem key={a.id} id={a.id} className="sd-glass rounded-2xl p-7">
              <a.icon className="h-5 w-5 text-[var(--sd-text-muted)]" />
              <p className="mt-5 text-lg font-semibold text-[var(--sd-text)]">{a.title}</p>
              <p className="mt-1 text-sm font-medium text-[var(--sd-accent)]">{a.tag}</p>
              <p className="mt-3 text-sm leading-relaxed text-[var(--sd-text-muted)]">{a.desc}</p>
              <ul className="mt-5 space-y-2 border-t sd-divider pt-5">
                {a.caps.map((c) => (
                  <li key={c} className="text-xs text-[var(--sd-text-muted)]">{c}</li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ============ HIDDEN SKILLS ============ */}
      <section className="border-t sd-divider px-4 py-28 sm:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text)]">
              You may know more
            </p>
            <p className="mt-1 text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text-muted)]">
              than your resume shows.
            </p>
            <p className="mx-auto mt-5 max-w-md text-base text-[var(--sd-text-muted)]">
              A student&apos;s activity can reveal capabilities that never appear under a formal job title.
            </p>
          </Reveal>

          <RevealGroup className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-3" stagger={0.1}>
            {hiddenChain.map((step, i) => (
              <Fragment key={step}>
                <RevealItem className="sd-glass rounded-full px-4 py-2 text-sm font-medium text-[var(--sd-text)]">{step}</RevealItem>
                {i < hiddenChain.length - 1 && <RevealItem className="text-[var(--sd-text-faint)]"><ArrowRight className="h-4 w-4" /></RevealItem>}
              </Fragment>
            ))}
          </RevealGroup>
          <Reveal delay={0.1} className="mt-8">
            <p className="text-sm text-[var(--sd-text-muted)]">
              SkillDex connects activities and evidence to uncover hidden and transferable skills.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ HOW SKILLDEX CONNECTS IT ALL (orbital) ============ */}
      <div id="loop">
        <IntelligenceLoop eyebrow="How SkillDex connects it all" />
      </div>

      {/* ============ CLOSING STATEMENT ============ */}
      <section className="border-t sd-divider px-4 py-28 text-center sm:py-36">
        <Reveal className="mx-auto max-w-2xl">
          <p className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text)]">
            One ecosystem. One skill language.
            <br />
            One connected intelligence layer.
          </p>
        </Reveal>
        <RevealGroup className="mx-auto mt-10 flex max-w-lg flex-col gap-2" stagger={0.08}>
          <RevealItem><p className="text-sm text-[var(--sd-text-muted)]">Students discover capability.</p></RevealItem>
          <RevealItem><p className="text-sm text-[var(--sd-text-muted)]">Institutions understand readiness.</p></RevealItem>
          <RevealItem><p className="text-sm text-[var(--sd-text-muted)]">Industry discovers talent.</p></RevealItem>
          <RevealItem><p className="text-sm font-semibold text-[var(--sd-text)]">SkillDex connects them.</p></RevealItem>
        </RevealGroup>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="border-t sd-divider px-4 py-36 sm:py-48">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-[var(--sd-text)]">
            The future of opportunity starts with connected skills.
          </p>
          <p className="mt-6 text-base text-[var(--sd-text-muted)]">Understand capability. Build evidence. Find opportunity.</p>
          <MagneticButton
            onClick={() => setDemoOpen(true)}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-transform active:scale-95"
          >
            Explore SkillDex <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </Reveal>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t sd-divider px-4 py-14">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">SD</div>
              <span className="text-sm font-semibold text-[var(--sd-text)]">SkillDex</span>
            </div>
            <p className="mt-2 text-xs text-[var(--sd-text-faint)]">Skill Intelligence for Academia &amp; Industry</p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--sd-text-muted)]">
            <a href="#loop" className="hover:text-[var(--sd-text)]">Intelligence</a>
            <a href="#connects" className="hover:text-[var(--sd-text)]">How It Works</a>
            <Link href="/institution" className="hover:text-[var(--sd-text)]">Institutions</Link>
            <Link href="/industry" className="hover:text-[var(--sd-text)]">Industry</Link>
          </nav>
          <p className="text-xs text-[var(--sd-text-faint)]">© 2026 SkillDex</p>
        </div>
      </footer>

      <DemoDialog open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
