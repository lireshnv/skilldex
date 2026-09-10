"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, GraduationCap, Users, TrendingUp } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const options = [
  {
    href: "/institution/student",
    icon: GraduationCap,
    title: "Student",
    description: "Track your skill readiness, build your digital passport, discover opportunities and prepare for interviews.",
  },
  {
    href: "/institution/faculty",
    icon: Users,
    title: "Faculty",
    description: "Map your expertise to industry demand, discover FDPs, research, consultancy and mentorship opportunities.",
  },
  {
    href: "/institution/placement",
    icon: TrendingUp,
    title: "Placement Cell",
    description: "Run the placement intelligence command center — analytics, skill gaps, and company relationships.",
  },
];

export default function InstitutionSelectionPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Institution" }]} />
        <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Portal Selection
        </Link>

        <div className="mt-6 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-navy text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Institution Intelligence Portal</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Choose your workspace to continue into the SkillDex academic ecosystem.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {options.map((o, i) => (
            <Link key={o.href} href={o.href} className="group">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="h-full rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-[var(--shadow-sm)] transition-shadow group-hover:shadow-[var(--shadow-lg)] group-hover:border-blue/30"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-blue-light text-blue-2 transition-transform group-hover:scale-110">
                  <o.icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-foreground">{o.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{o.description}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-2">
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
