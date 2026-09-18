"use client";
import "../../styles/landing.css";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, UserSearch, Building2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { HeroNetwork } from "@/components/landing/hero-network";

const options = [
  {
    href: "/industry/recruiter",
    icon: UserSearch,
    title: "Recruiter",
    accent: "#38bdf8",
    description: "Find candidates, create jobs, shortlist, assess, interview and hire — all in one talent intelligence workspace.",
  },
  {
    href: "/industry/company",
    icon: Building2,
    title: "HR / Company",
    accent: "#a78bfa",
    description: "Post opportunities, connect with colleges, launch internships, run hackathons and collaborate with faculty.",
  },
];

export default function IndustrySelectionPage() {
  return (
    <div className="sd-landing relative min-h-screen overflow-hidden">
      <div className="sd-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="sd-network-mask pointer-events-none absolute inset-0 opacity-45" style={{ filter: "hue-rotate(30deg)" }}>
        <HeroNetwork />
      </div>
      <div className="sd-grain" />

      <div className="relative mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Industry" }]} />
        <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--sd-text-muted)] hover:text-[var(--sd-text)]">
          <ArrowLeft className="h-4 w-4" /> Back to Portal Selection
        </Link>

        <div className="mt-10 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--sd-border-strong)] bg-[var(--sd-surface-strong)] text-[var(--sd-accent)]">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--sd-text)] sm:text-4xl">Industry Collaboration Portal</h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[var(--sd-text-muted)]">
            Choose how your organization wants to engage with the SkillDex ecosystem.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {options.map((o, i) => (
            <Link key={o.href} href={o.href} className="group">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="sd-glass relative h-full overflow-hidden rounded-2xl p-7 transition-colors group-hover:border-[var(--sd-border-strong)]"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
                  style={{ background: o.accent }}
                />
                <div
                  className="relative flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ background: `${o.accent}1f`, color: o.accent }}
                >
                  <o.icon className="h-6 w-6" />
                </div>
                <h3 className="relative mt-5 text-lg font-bold text-[var(--sd-text)]">{o.title}</h3>
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
