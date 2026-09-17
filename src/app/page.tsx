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
import { MagneticButton } from "@/components/landing/magnetic-button";
import { Reveal, RevealGroup, RevealItem } from "@/components/landing/reveal";
import { revealUp } from "@/lib/landing-motion";

const problems = [
  "Students don't know what they are capable of.",
  "Institutions don't have a live view of skill readiness.",
  "Industry struggles to discover capability beyond resumes.",
];

const hiddenChain = ["Hackathon", "Team Leadership", "Problem Solving", "Product Thinking", "Communication"];

const howItWorks = [
  { n: "01", label: "Understand", desc: "Map what a person actually knows, verified against real work." },
  { n: "02", label: "Identify", desc: "Surface gaps and transferable skills, not just resume keywords." },
  { n: "03", label: "Develop", desc: "A personalized path toward the role someone is aiming for." },
  { n: "04", label: "Connect", desc: "Capability matched to real opportunities, evidence-first." },
];

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
          <h1 className="max-w-4xl text-[clamp(2.75rem,9vw,6rem)] font-semibold leading-[0.98] tracking-tight text-[var(--sd-text)]">
            Where Skills
            <br />
            Become Opportunity.
          </h1>
          <p className="mt-7 max-w-lg text-base leading-relaxed text-[var(--sd-text-muted)] sm:text-lg">
            Understand capability. Discover potential. Connect talent with the opportunities that matter.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              onClick={() => setDemoOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform active:scale-95"
            >
              Explore SkillDex <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton
              onClick={() => document.getElementById("loop")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--sd-border-strong)] px-6 py-3 text-sm font-medium text-[var(--sd-text)] transition-colors hover:border-white/30"
            >
              See how it works
            </MagneticButton>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 h-8 w-px bg-gradient-to-b from-transparent via-[var(--sd-border-strong)] to-transparent"
        />
      </section>

      {/* ============ PROBLEM ============ */}
      <section className="relative border-t sd-divider px-4 py-32 sm:py-44">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text)]">
              The problem isn&apos;t a lack of talent.
            </p>
            <p className="mt-1 text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text-muted)]">
              It&apos;s a lack of visibility.
            </p>
          </Reveal>

          <RevealGroup className="mx-auto mt-20 flex max-w-xl flex-col gap-8" stagger={0.15}>
            {problems.map((p) => (
              <RevealItem key={p}>
                <p className="text-lg leading-relaxed text-[var(--sd-text-muted)] sm:text-xl">{p}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ============ INTELLIGENCE LOOP ============ */}
      <div id="loop">
        <IntelligenceLoop />
      </div>

      {/* ============ SKILL GRAPH ============ */}
      <section className="border-t sd-divider px-4 py-28 sm:py-36">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--sd-text-faint)]">03 — Knowledge Graph</p>
            <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text)]">
              Skills are connected.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--sd-text-muted)]">
              SkillDex maps the relationships between skills, roles, projects and opportunities — hover a node to see what it connects to.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="sd-glass rounded-2xl p-6">
              <SkillGraphMini />
            </div>
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
          </Reveal>
        </div>

        <RevealGroup className="mx-auto mt-16 flex max-w-3xl flex-col items-stretch gap-4 sm:flex-row sm:items-center" stagger={0.12}>
          <RevealItem className="sd-glass flex-1 rounded-2xl p-6 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--sd-text-faint)]">Evidence</p>
            <p className="mt-2 text-base font-semibold text-[var(--sd-text)]">Computer Vision Pipeline</p>
            <p className="mt-1 text-xs text-[var(--sd-text-muted)]">Python · OpenCV · PyTorch</p>
            <p className="mt-3 text-[11px] text-[var(--sd-text-faint)]">GitHub · Assessment · Project</p>
          </RevealItem>
          <RevealItem className="flex shrink-0 justify-center text-[var(--sd-text-faint)]">
            <ArrowRight className="h-5 w-5 rotate-90 sm:rotate-0" />
          </RevealItem>
          <RevealItem className="sd-glass-strong flex-1 rounded-2xl p-6 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--sd-accent)]">Opportunity</p>
            <p className="mt-2 text-base font-semibold text-[var(--sd-text)]">ML Engineer Internship</p>
            <p className="mt-1 text-xs text-[var(--sd-text-muted)]">Evidence-based alignment</p>
            <p className="mt-3 text-2xl font-bold text-[var(--sd-text)]">92<span className="text-sm font-medium text-[var(--sd-text-muted)]">%</span></p>
          </RevealItem>
        </RevealGroup>
      </section>

      {/* ============ THREE ECOSYSTEMS ============ */}
      <Ecosystems />

      {/* ============ AUDIENCE ============ */}
      <section className="border-t sd-divider px-4 py-28 sm:py-36">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--sd-text-faint)]">Built for the whole ecosystem</p>
          <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text)]">
            One platform, three vantage points.
          </h2>
        </Reveal>

        <RevealGroup className="mx-auto mt-16 grid max-w-5xl gap-4 sm:grid-cols-3" stagger={0.12}>
          <RevealItem id="student" className="sd-glass rounded-2xl p-7">
            <GraduationCap className="h-5 w-5 text-[var(--sd-text-muted)]" />
            <p className="mt-5 text-lg font-semibold text-[var(--sd-text)]">Students</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--sd-text-muted)]">Know what you&apos;re capable of, and what to build next.</p>
          </RevealItem>
          <RevealItem id="institution" className="sd-glass rounded-2xl p-7">
            <Building2 className="h-5 w-5 text-[var(--sd-text-muted)]" />
            <p className="mt-5 text-lg font-semibold text-[var(--sd-text)]">Institutions</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--sd-text-muted)]">See your institution through its skills, not just its rankings.</p>
          </RevealItem>
          <RevealItem id="industry" className="sd-glass rounded-2xl p-7">
            <UserSearch className="h-5 w-5 text-[var(--sd-text-muted)]" />
            <p className="mt-5 text-lg font-semibold text-[var(--sd-text)]">Industry</p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--sd-text-muted)]">Find capability. Not just resumes.</p>
          </RevealItem>
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
          </Reveal>

          <RevealGroup className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-3" stagger={0.1}>
            {hiddenChain.map((step, i) => (
              <Fragment key={step}>
                <RevealItem className="sd-glass rounded-full px-4 py-2 text-sm font-medium text-[var(--sd-text)]">{step}</RevealItem>
                {i < hiddenChain.length - 1 && <RevealItem className="text-[var(--sd-text-faint)]"><ArrowRight className="h-4 w-4" /></RevealItem>}
              </Fragment>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="border-t sd-divider px-4 py-28 sm:py-36">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--sd-text-faint)]">How it works</p>
          <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-tight tracking-tight text-[var(--sd-text)]">
            From capability to outcome.
          </h2>
        </Reveal>

        <RevealGroup className="mx-auto mt-16 grid max-w-5xl gap-px overflow-hidden rounded-2xl sd-glass sm:grid-cols-4" stagger={0.1}>
          {howItWorks.map((s) => (
            <RevealItem key={s.n} className="group bg-[var(--sd-bg-raised)] p-7 transition-colors hover:bg-white/[0.03]">
              <p className="text-xs font-mono text-[var(--sd-text-faint)]">{s.n}</p>
              <p className="mt-4 text-lg font-semibold text-[var(--sd-text)]">{s.label}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--sd-text-muted)]">{s.desc}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="border-t sd-divider px-4 py-36 sm:py-48">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.05] tracking-tight text-[var(--sd-text)]">
            The future of opportunity starts with understanding skills.
          </p>
          <p className="mt-6 text-base text-[var(--sd-text-muted)]">SkillDex connects capability with possibility.</p>
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
            <Link href="/institution" className="hover:text-[var(--sd-text)]">Institutions</Link>
            <Link href="/industry" className="hover:text-[var(--sd-text)]">Industry</Link>
            <a href="#loop" className="hover:text-[var(--sd-text)]">How It Works</a>
          </nav>
          <p className="text-xs text-[var(--sd-text-faint)]">© 2026 SkillDex</p>
        </div>
      </footer>

      <DemoDialog open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}
