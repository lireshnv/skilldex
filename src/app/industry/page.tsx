"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, UserSearch, Building2 } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

const options = [
  {
    href: "/industry/recruiter",
    icon: UserSearch,
    title: "Recruiter",
    description: "Find candidates, create jobs, shortlist, assess, interview and hire — all in one talent intelligence workspace.",
  },
  {
    href: "/industry/company",
    icon: Building2,
    title: "Company / Industry",
    description: "Post opportunities, connect with colleges, launch internships, run hackathons and collaborate with faculty.",
  },
];

export default function IndustrySelectionPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Industry" }]} />
        <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Portal Selection
        </Link>

        <div className="mt-6 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-navy text-white">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Industry Collaboration Portal</h1>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
            Choose how your organization wants to engage with the SkillDex ecosystem.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {options.map((o, i) => (
            <Link key={o.href} href={o.href} className="group">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="h-full rounded-[var(--radius-lg)] border border-border bg-surface p-7 shadow-[var(--shadow-sm)] transition-shadow group-hover:shadow-[var(--shadow-lg)] group-hover:border-blue/30"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-violet-light text-violet transition-transform group-hover:scale-110">
                  <o.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{o.title}</h3>
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
