"use client";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, GraduationCap, Building2, Sparkles, Target, TrendingUp,
  Users, Network, BadgeCheck, Rocket, PlayCircle, Menu, X, School,
  UserSearch, Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useSkillDexStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { fadeUp } from "@/lib/motion";

const loopSteps = [
  { label: "Assess", icon: Target },
  { label: "Identify Gap", icon: TrendingUp },
  { label: "Learn", icon: BadgeCheck },
  { label: "Build Evidence", icon: Sparkles },
  { label: "Connect", icon: Network },
  { label: "Opportunity", icon: Briefcase },
  { label: "Outcome", icon: Rocket },
  { label: "Skill Update", icon: Users },
];

const innovations = [
  { title: "Closed-Loop Skill Evolution", desc: "Every outcome feeds back into the skill model, so recommendations keep getting sharper over time." },
  { title: "Evidence-to-Opportunity Intelligence", desc: "Skills are matched to real opportunities using verified evidence, not self-reported claims." },
  { title: "Hidden & Transferable Skill Discovery", desc: "Surfaces skills students don't know they have, mapped to unconventional career paths." },
  { title: "Activity-Based College Discovery", desc: "Industry finds colleges based on real hackathon, project and placement activity — not just rankings." },
  { title: "Outcome-Calibrated Intelligence", desc: "Recommendations are continuously calibrated against real hiring and academic outcomes." },
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
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-navy text-sm font-bold text-white">SD</div>
            <span className="text-base font-bold text-foreground">SkillDex</span>
          </div>
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#about" className="hover:text-foreground">About</a>
            <a href="#how-it-works" className="hover:text-foreground">How It Works</a>
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#students" className="hover:text-foreground">For Students</a>
            <a href="#institutions" className="hover:text-foreground">For Institutions</a>
            <a href="#industry" className="hover:text-foreground">For Industry</a>
            <a href="#contact" className="hover:text-foreground">Contact</a>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" onClick={() => setDemoOpen(true)}>
              <PlayCircle className="h-4 w-4" /> Explore Demo
            </Button>
            <Button variant="primary" size="sm" onClick={() => document.getElementById("portals")?.scrollIntoView({ behavior: "smooth" })}>
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <button className="md:hidden" onClick={() => setMobileNav((v) => !v)} aria-label="Toggle menu">
            {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileNav && (
          <div className="border-t border-border bg-surface px-4 py-3 md:hidden">
            <div className="flex flex-col gap-3 text-sm font-medium text-muted-foreground">
              <a href="#about" onClick={() => setMobileNav(false)}>About</a>
              <a href="#how-it-works" onClick={() => setMobileNav(false)}>How It Works</a>
              <a href="#features" onClick={() => setMobileNav(false)}>Features</a>
              <a href="#students" onClick={() => setMobileNav(false)}>For Students</a>
              <a href="#institutions" onClick={() => setMobileNav(false)}>For Institutions</a>
              <a href="#industry" onClick={() => setMobileNav(false)}>For Industry</a>
              <Button variant="primary" size="sm" onClick={() => { setMobileNav(false); setDemoOpen(true); }}>
                Explore Demo
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-dot-grid">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(219,234,254,0.7),transparent_65%)]" />
        <motion.div
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8"
        >
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue/30 bg-surface/90 px-4 py-1.5 text-xs font-semibold text-blue-2 shadow-sm backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-blue animate-pulse" />
            <Sparkles className="h-3.5 w-3.5 text-blue" />
            Skill Intelligence for Academia & Industry
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.1]">
            Where Skills Meet <span className="text-gradient-accent">Opportunity.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-xl leading-relaxed">
            Assess verified competencies. Discover hidden potential. Connect academia, student capability, and corporate hiring through verified intelligence.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button variant="primary" size="lg" onClick={() => document.getElementById("portals")?.scrollIntoView({ behavior: "smooth" })}>
              Enter SkillDex Workspace <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => setDemoOpen(true)}>
              <PlayCircle className="h-4 w-4 text-blue-2" /> Interactive Demo
            </Button>
          </div>
          <p className="mt-4 text-xs font-medium text-muted-foreground/80">Skills Today. Brighter Tomorrow.</p>
        </motion.div>
      </section>

      {/* Problem / About */}
      <section id="about" className="border-y border-border/80 bg-surface/50 py-16 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { stat: "60%+", label: "of graduates report a mismatch between college learning and industry-required skills." },
              { stat: "3-6 mo", label: "average time institutions spend manually matching students with the right companies." },
              { stat: "1000s", label: "of hidden and transferable skills go undiscovered without evidence-based intelligence." },
            ].map((s) => (
              <div key={s.label} className="text-center p-6 rounded-[var(--radius-lg)] bg-surface border border-border/60 shadow-sm">
                <p className="text-4xl font-extrabold text-navy tracking-tight">{s.stat}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works - intelligence loop */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-2">Continuous Calibration</span>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">The SkillDex Intelligence Loop</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              A closed-loop system where every real outcome continuously improves the next recommendation.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {loopSteps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="flex flex-col items-center gap-2.5 rounded-[var(--radius-lg)] border border-border/80 bg-surface p-4 text-center shadow-[var(--shadow-sm)] hover:border-blue/40 hover:shadow-md transition-all cursor-default"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-light text-blue-2 shadow-xs">
                  <step.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-foreground">{step.label}</p>
                {i < loopSteps.length - 1 && <ArrowRight className="hidden h-3.5 w-3.5 text-border-strong lg:block" />}
              </motion.div>
            ))}
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {innovations.map((item) => (
              <div key={item.title} className="rounded-[var(--radius-lg)] border border-border/70 bg-surface p-5 hover:border-blue/30 transition-colors shadow-xs">
                <p className="text-sm font-bold text-foreground">{item.title}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature sections for each stakeholder */}
      <section id="features" className="border-y border-border/80 bg-surface-muted/40 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <StakeholderCard id="students" icon={GraduationCap} title="For Students" question="What should I do next?" points={["Verified digital skill passport", "Personalized daily plan", "Company & career-path intelligence"]} />
            <StakeholderCard id="institutions" icon={School} title="For Institutions" question="How do I improve readiness?" points={["Placement command center", "Skill gap analytics", "Resource & company intelligence"]} />
            <StakeholderCard id="industry" icon={Building2} title="For Industry" question="Who should we collaborate with?" points={["Verified talent discovery", "College & startup discovery", "End-to-end hiring pipelines"]} />
          </div>
        </div>
      </section>

      {/* Portal selection */}
      <section id="portals" className="py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-2">Workspaces</span>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Choose Your Workspace</h2>
          <p className="mt-3 text-sm text-muted-foreground">Two connected ecosystems, one unified intelligence platform.</p>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <PortalCard
              href="/institution"
              icon={GraduationCap}
              title="Institution"
              description="Manage students, faculty, placements, skill development and industry relationships."
              cta="Enter Institution"
              gradient="from-blue-light/70 to-surface"
            />
            <PortalCard
              href="/industry"
              icon={Building2}
              title="Industry"
              description="Discover talent, connect with institutions and build hiring and collaboration pipelines."
              cta="Enter Industry"
              gradient="from-violet-light/70 to-surface"
            />
          </div>

          <button onClick={() => setDemoOpen(true)} className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-2 hover:underline cursor-pointer">
            <PlayCircle className="h-4 w-4" /> Or jump straight into a guided demo
          </button>
        </div>
      </section>

      {/* Contact / CTA footer */}
      <footer id="contact" className="border-t border-border bg-navy py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-white/10 text-sm font-bold">SD</div>
                <span className="text-base font-bold">SkillDex</span>
              </div>
              <p className="mt-3 max-w-sm text-sm text-white/60">
                Connecting Talent. Empowering Futures. The skill intelligence layer for academia and industry.
              </p>
            </div>
            <div className="flex gap-12 text-sm text-white/70">
              <div className="space-y-2">
                <p className="font-semibold text-white">Platform</p>
                <p>How It Works</p>
                <p>Features</p>
                <p>Demo</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-white">Stakeholders</p>
                <p>Students</p>
                <p>Institutions</p>
                <p>Industry</p>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/40">
            © 2026 SkillDex. Built for the modern academia-industry ecosystem.
          </div>
        </div>
      </footer>

      <DemoDialog open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  );
}

function StakeholderCard({ id, icon: Icon, title, question, points }: { id: string; icon: typeof GraduationCap; title: string; question: string; points: string[] }) {
  return (
    <motion.div
      id={id}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="rounded-[var(--radius-lg)] border border-border/80 bg-surface p-7 shadow-sm hover:border-blue/30 hover:shadow-md transition-all"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white shadow-sm">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-5 text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-1 text-sm font-medium italic text-blue-2">&ldquo;{question}&rdquo;</p>
      <ul className="mt-5 space-y-2.5">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
            <BadgeCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald" /> {p}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function PortalCard({ href, icon: Icon, title, description, cta, gradient }: { href: string; icon: typeof GraduationCap; title: string; description: string; cta: string; gradient: string }) {
  return (
    <Link href={href} className="group block">
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`relative overflow-hidden rounded-[var(--radius-xl)] border border-border/90 bg-gradient-to-br ${gradient} p-8 text-left shadow-sm group-hover:border-blue/40 group-hover:shadow-[0_20px_40px_-15px_rgba(29,78,216,0.15)] transition-all`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy text-white shadow-md transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="mt-6 text-2xl font-extrabold text-foreground">{title} Workspace</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-2">
          {cta}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
        </div>
      </motion.div>
    </Link>
  );
}
