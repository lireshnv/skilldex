"use client";
import "../../styles/landing.css";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Building2, ShieldCheck } from "lucide-react";
import { HeroNetwork } from "@/components/landing/hero-network";
import { Avatar } from "@/components/ui/avatar";

const orgs = [
  {
    href: "/institution",
    icon: GraduationCap,
    title: "Institution",
    accent: "#6ea8ff",
    roles: ["Student", "Faculty", "Placement Cell"],
    description: "For colleges and universities running skill intelligence across students and faculty.",
  },
  {
    href: "/industry",
    icon: Building2,
    title: "Industry",
    accent: "#a78bfa",
    roles: ["Recruiter", "HR / Company"],
    description: "For companies discovering talent, posting opportunities and collaborating with institutions.",
  },
];

export default function LoginPage() {
  return (
    <div className="sd-landing relative min-h-screen overflow-hidden">
      <div className="sd-grid sd-network-mask pointer-events-none absolute inset-0 opacity-50">
        <HeroNetwork />
      </div>
      <div className="sd-grain" />

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-[var(--sd-text)]">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--sd-accent)] text-[11px] font-black text-[#050505]">SD</span>
          SkillDex
        </Link>

        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--sd-border-strong)] bg-[var(--sd-surface-strong)] px-3 py-1 text-[11px] font-semibold tracking-wide text-[var(--sd-text-muted)]">
            <ShieldCheck className="h-3 w-3 text-[var(--sd-accent)]" /> ROLE-BASED ACCESS
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--sd-text)] sm:text-4xl">Sign in to SkillDex</h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--sd-text-muted)]">
            Choose your organization type, then your role. This demo environment signs you in as{" "}
            <strong className="text-[var(--sd-text)]">Liresh N.V.</strong>, Rajalakshmi Engineering College — no password required.
          </p>
        </div>

        <div className="mt-10 grid w-full gap-5 sm:grid-cols-2">
          {orgs.map((o, i) => (
            <Link key={o.href} href={o.href} className="group">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                className="sd-glass relative h-full overflow-hidden rounded-2xl p-7 transition-colors group-hover:border-[var(--sd-border-strong)]"
              >
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25"
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
                <div className="relative mt-4 flex flex-wrap gap-1.5">
                  {o.roles.map((r) => (
                    <span key={r} className="rounded-full border border-[var(--sd-border)] px-2.5 py-1 text-[11px] font-medium text-[var(--sd-text-muted)]">
                      {r}
                    </span>
                  ))}
                </div>
                <div className="relative mt-5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: o.accent }}>
                  Continue as {o.title} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="sd-glass mt-8 flex items-center gap-3 rounded-full px-4 py-2.5">
          <Avatar name="Liresh N.V." color="#6ea8ff" size={28} />
          <div className="text-left leading-tight">
            <p className="text-xs font-semibold text-[var(--sd-text)]">Demo identity: Liresh N.V.</p>
            <p className="text-[10px] text-[var(--sd-text-muted)]">Used across every role for a consistent walkthrough</p>
          </div>
        </div>
      </div>
    </div>
  );
}
