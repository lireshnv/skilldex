"use client";
import "../../styles/landing.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Building2, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { HeroNetwork } from "@/components/landing/hero-network";
import { Avatar } from "@/components/ui/avatar";
import { signIn, AuthApiError } from "@/lib/auth-api";
import { useSkillDexStore } from "@/lib/store";

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
  const router = useRouter();
  const setAuth = useSkillDexStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await signIn(email, password);
      setAuth(res.token, res.user);
      router.push(res.dashboard);
    } catch (err) {
      setError(err instanceof AuthApiError ? err.message : "Something went wrong signing you in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="sd-landing relative min-h-screen overflow-hidden">
      <div className="sd-grid sd-network-mask pointer-events-none absolute inset-0 opacity-50">
        <HeroNetwork />
      </div>
      <div className="sd-grain" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-[var(--sd-text)]">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--sd-accent)] text-[11px] font-black text-[#050505]">SD</span>
          SkillDex
        </Link>

        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--sd-border-strong)] bg-[var(--sd-surface-strong)] px-3 py-1 text-[11px] font-semibold tracking-wide text-[var(--sd-text-muted)]">
            <ShieldCheck className="h-3 w-3 text-[var(--sd-accent)]" /> WELCOME BACK
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--sd-text)]">Sign in to SkillDex</h1>
        </div>

        <form onSubmit={handleSignIn} className="sd-glass mt-8 w-full space-y-3 rounded-2xl p-6">
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-[var(--sd-text-muted)]">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-[var(--sd-border-strong)] bg-black/30 px-3 py-2.5 text-sm text-[var(--sd-text)] placeholder:text-[var(--sd-text-faint)] outline-none focus:border-[var(--sd-accent)] transition-colors"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-[var(--sd-text-muted)]">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[var(--sd-border-strong)] bg-black/30 px-3 py-2.5 pr-10 text-sm text-[var(--sd-text)] placeholder:text-[var(--sd-text-faint)] outline-none focus:border-[var(--sd-accent)] transition-colors"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--sd-text-muted)]">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          {error && <p className="rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (<><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>) : "Sign In"}
          </button>

          <p className="text-center text-xs text-[var(--sd-text-muted)]">
            Don&apos;t have an account? <Link href="/register" className="font-semibold text-[var(--sd-text)] hover:underline">Create account →</Link>
          </p>
        </form>

        <div className="mt-10 w-full">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--sd-border)]" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--sd-text-faint)]">or explore a demo workspace</span>
            <div className="h-px flex-1 bg-[var(--sd-border)]" />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {orgs.map((o, i) => (
              <Link key={o.href} href={o.href} className="group">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -3 }}
                  className="sd-glass relative h-full overflow-hidden rounded-xl p-4 transition-colors group-hover:border-[var(--sd-border-strong)]"
                >
                  <div
                    className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                    style={{ background: `${o.accent}1f`, color: o.accent }}
                  >
                    <o.icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="relative mt-3 text-sm font-bold text-[var(--sd-text)]">{o.title}</h3>
                  <p className="relative mt-1 text-[11px] leading-snug text-[var(--sd-text-muted)]">{o.description}</p>
                  <div className="relative mt-3 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: o.accent }}>
                    Continue <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="sd-glass mt-4 flex items-center gap-3 rounded-full px-4 py-2.5">
            <Avatar name="Liresh N.V." color="#6ea8ff" size={26} />
            <div className="text-left leading-tight">
              <p className="text-[11px] font-semibold text-[var(--sd-text)]">Demo identity: Liresh N.V.</p>
              <p className="text-[10px] text-[var(--sd-text-muted)]">No account needed — jump straight into any workspace</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
