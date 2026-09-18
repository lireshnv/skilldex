"use client";
import "../../styles/landing.css";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, GraduationCap, Users, TrendingUp } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { HeroNetwork } from "@/components/landing/hero-network";

const options = [
  {
    href: "/institution/student",
    icon: GraduationCap,
    title: "Student",
    accent: "#6ea8ff",
    description: "Track your skill readiness, build your digital passport, discover opportunities and prepare for interviews.",
  },
  {
    href: "/institution/faculty",
    icon: Users,
    title: "Faculty",
    accent: "#a78bfa",
    description: "Map your expertise to industry demand, discover FDPs, research, consultancy and mentorship opportunities.",
  },
  {
    href: "/institution/placement",
    icon: TrendingUp,
    title: "Placement Cell",
    accent: "#34d399",
    description: "Run the placement intelligence command center — analytics, skill gaps, and company relationships.",
  },
];

export default function InstitutionSelectionPage() {
  return (
    <div className="sd-landing relative min-h-screen overflow-hidden">
      <div className="sd-grid sd-network-mask pointer-events-none absolute inset-0 opacity-60">
        <HeroNetwork />
      </div>
      <div className="sd-grain" />

      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Institution" }]} />
        <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--sd-text-muted)] hover:text-[var(--sd-text)]">
          <ArrowLeft className="h-4 w-4" /> Back to Portal Selection
        </Link>

        <div className="mt-10 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--sd-border-strong)] bg-[var(--sd-surface-strong)] text-[var(--sd-accent)]">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--sd-text)] sm:text-4xl">Institution Intelligence Portal</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[var(--sd-text-muted)]">
            Choose your workspace to continue into the SkillDex academic ecosystem — one skill graph, three vantage points.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {options.map((o, i) => (
            <Link key={o.href} href={o.href} className="group">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="sd-glass relative h-full overflow-hidden rounded-2xl p-6 transition-colors group-hover:border-[var(--sd-border-strong)]"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
                  style={{ background: o.accent }}
                />
                <div
                  className="relative flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ background: `${o.accent}1f`, color: o.accent }}
                >
                  <o.icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="relative mt-4 text-base font-bold text-[var(--sd-text)]">{o.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-[var(--sd-text-muted)]">{o.description}</p>
                <div className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: o.accent }}>
                  Enter {o.title} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
