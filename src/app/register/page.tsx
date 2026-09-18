"use client";
import "../../styles/landing.css";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, GraduationCap, Users, Landmark, Factory,
  UserSearch, Eye, EyeOff, Loader2, ShieldCheck,
} from "lucide-react";
import { AuthBackground } from "@/components/landing/auth-background";
import { register, fetchRoleOptions, AuthApiError, RoleOptionsResponse } from "@/lib/auth-api";
import { useSkillDexStore } from "@/lib/store";

type Role = "student" | "faculty" | "institution_admin" | "industry" | "recruiter";

const roleMeta: Record<Role, { label: string; icon: typeof GraduationCap; blurb: string }> = {
  student: { label: "Student", icon: GraduationCap, blurb: "Track skills, discover opportunities, prepare for interviews." },
  faculty: { label: "Faculty", icon: Users, blurb: "Map expertise to industry demand, mentor students." },
  institution_admin: { label: "Institution Admin", icon: Landmark, blurb: "Run placement intelligence for your institution." },
  industry: { label: "Industry / Company", icon: Factory, blurb: "Post opportunities, discover talent and institutions." },
  recruiter: { label: "Recruiter", icon: UserSearch, blurb: "Find, assess and hire verified talent." },
};

const roleFieldConfig: Record<Role, { key: string; label: string; required: boolean; type?: "number" }[]> = {
  student: [
    { key: "studentId", label: "Student ID / Register Number", required: true },
    { key: "institution", label: "Institution", required: true },
    { key: "program", label: "Program / Degree", required: false },
    { key: "department", label: "Department", required: false },
    { key: "year", label: "Year", required: false, type: "number" },
  ],
  faculty: [
    { key: "facultyId", label: "Faculty ID / Employee ID", required: true },
    { key: "institution", label: "Institution", required: true },
    { key: "department", label: "Department", required: false },
    { key: "designation", label: "Designation", required: false },
  ],
  institution_admin: [
    { key: "institutionId", label: "Institution ID", required: true },
    { key: "institutionName", label: "Institution Name", required: true },
    { key: "designation", label: "Designation", required: false },
  ],
  industry: [
    { key: "companyId", label: "Company ID / Registration ID", required: true },
    { key: "companyName", label: "Company Name", required: true },
    { key: "designation", label: "Designation", required: false },
  ],
  recruiter: [
    { key: "recruiterId", label: "Recruiter ID / Employee ID", required: true },
    { key: "company", label: "Company", required: true },
    { key: "designation", label: "Designation", required: false },
  ],
};

const steps = ["Account", "Role", "Identity", "Tags", "Confirm"];

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useSkillDexStore((s) => s.setAuth);
  const [step, setStep] = useState(0);
  const [options, setOptions] = useState<RoleOptionsResponse | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [role, setRole] = useState<Role | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<string[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ name: string; role: string; dashboard: string } | null>(null);

  useEffect(() => {
    fetchRoleOptions().then(setOptions);
  }, []);

  const accountValid = name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && password.length >= 8 && password === confirmPassword;
  const identityValid = role
    ? roleFieldConfig[role].filter((f) => f.required).every((f) => fields[f.key]?.trim())
    : false;

  function next() {
    setError(null);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    if (!role) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await register({ name, email, password, role, roleFields: fields, tags });
      setAuth(res.token, res.user);
      setSuccess({ name: res.user.name, role: res.user.role, dashboard: res.dashboard });
    } catch (e) {
      setError(e instanceof AuthApiError ? e.message : "We couldn't create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const tagOptions = role && options ? options.tagOptions[role] ?? [] : [];

  if (success) {
    return (
      <div className="sd-landing relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <AuthBackground />
        <div className="sd-grain" />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="sd-glass relative w-full max-w-md rounded-2xl p-8 text-center"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
            <Check className="h-6 w-6" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--sd-text-muted)]">Account created</p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--sd-text)]">Welcome to SkillDex, {success.name.split(" ")[0]}.</h1>
          <p className="mt-2 text-sm text-[var(--sd-text-muted)]">Your workspace is ready.</p>
          <div className="mt-5 flex justify-center gap-2 text-xs">
            <span className="rounded-full border border-[var(--sd-border-strong)] px-3 py-1 font-medium text-[var(--sd-text-muted)]">{roleMeta[success.role as Role]?.label ?? success.role}</span>
          </div>
          <button
            onClick={() => router.push(success.dashboard)}
            className="mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-95"
          >
            Enter SkillDex <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="sd-landing relative min-h-screen overflow-hidden">
      <AuthBackground />
      <div className="sd-grain" />

      <div className="relative mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-16">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--sd-text)]">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--sd-accent)] text-[11px] font-black text-[#050505]">SD</span>
          SkillDex
        </Link>

        {/* progress */}
        <div className="mb-8 flex w-full items-center justify-between">
          {steps.map((s, i) => (
            <div key={s} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                    i < step ? "bg-[var(--sd-accent)] text-[#050505]" : i === step ? "border-2 border-[var(--sd-accent)] text-[var(--sd-text)]" : "border border-[var(--sd-border-strong)] text-[var(--sd-text-muted)]"
                  }`}
                >
                  {i < step ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                <span className={`text-[10px] font-medium ${i <= step ? "text-[var(--sd-text)]" : "text-[var(--sd-text-muted)]"}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className={`mx-1.5 h-px flex-1 ${i < step ? "bg-[var(--sd-accent)]" : "bg-[var(--sd-border)]"}`} />}
            </div>
          ))}
        </div>

        <div className="sd-glass w-full overflow-hidden rounded-2xl p-7">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="account" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                <h2 className="text-lg font-bold text-[var(--sd-text)]">Create your account</h2>
                <p className="mt-1 text-xs text-[var(--sd-text-muted)]">Just the essentials to get started.</p>
                <div className="mt-5 space-y-3">
                  <Field label="Full Name"><input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Liresh N.V." /></Field>
                  <Field label="Email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" /></Field>
                  <Field label="Password">
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} placeholder="At least 8 characters" />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--sd-text-muted)]">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </Field>
                  <Field label="Confirm Password"><input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} placeholder="Re-enter password" /></Field>
                  {password && confirmPassword && password !== confirmPassword && <p className="text-xs text-rose-400">Passwords don&apos;t match.</p>}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="role" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                <h2 className="text-lg font-bold text-[var(--sd-text)]">I am a...</h2>
                <p className="mt-1 text-xs text-[var(--sd-text-muted)]">This determines your dashboard and required ID.</p>
                <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {(Object.keys(roleMeta) as Role[]).map((r) => {
                    const meta = roleMeta[r];
                    const selected = role === r;
                    return (
                      <button
                        key={r}
                        onClick={() => setRole(r)}
                        className={`flex flex-col items-start gap-1.5 rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                          selected ? "border-[var(--sd-accent)] bg-[rgba(110,168,255,0.08)]" : "border-[var(--sd-border)] hover:border-[var(--sd-border-strong)]"
                        }`}
                      >
                        <meta.icon className={`h-5 w-5 ${selected ? "text-[var(--sd-accent)]" : "text-[var(--sd-text-muted)]"}`} />
                        <p className="text-sm font-semibold text-[var(--sd-text)]">{meta.label}</p>
                        <p className="text-[11px] leading-snug text-[var(--sd-text-muted)]">{meta.blurb}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && role && (
              <motion.div key="identity" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                <h2 className="text-lg font-bold text-[var(--sd-text)]">Your {roleMeta[role].label} identity</h2>
                <p className="mt-1 text-xs text-[var(--sd-text-muted)]">Used to associate your account with the right institution or company.</p>
                <div className="mt-5 space-y-3">
                  {roleFieldConfig[role].map((f) => (
                    <Field key={f.key} label={f.label + (f.required ? " *" : "")}>
                      <input
                        type={f.type ?? "text"}
                        value={fields[f.key] ?? ""}
                        onChange={(e) => setFields((v) => ({ ...v, [f.key]: e.target.value }))}
                        className={inputClass}
                      />
                    </Field>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && role && (
              <motion.div key="tags" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                <h2 className="text-lg font-bold text-[var(--sd-text)]">What are you into?</h2>
                <p className="mt-1 text-xs text-[var(--sd-text-muted)]">Optional — helps tailor recommendations. Pick as many as apply.</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {tagOptions.length === 0 && <p className="text-xs text-[var(--sd-text-muted)]">Loading tag options…</p>}
                  {tagOptions.map((t) => {
                    const selected = tags.includes(t);
                    return (
                      <button
                        key={t}
                        onClick={() => setTags((v) => (selected ? v.filter((x) => x !== t) : [...v, t]))}
                        className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                          selected ? "border-[var(--sd-accent)] bg-[rgba(110,168,255,0.1)] text-[var(--sd-text)]" : "border-[var(--sd-border)] text-[var(--sd-text-muted)] hover:border-[var(--sd-border-strong)]"
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 4 && role && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
                <h2 className="text-lg font-bold text-[var(--sd-text)]">Confirm your details</h2>
                <div className="mt-5 space-y-2.5 rounded-xl border border-[var(--sd-border)] p-4">
                  <SummaryRow label="Name" value={name} />
                  <SummaryRow label="Email" value={email} />
                  <SummaryRow label="Role" value={roleMeta[role].label} />
                  {roleFieldConfig[role].filter((f) => fields[f.key]).map((f) => (
                    <SummaryRow key={f.key} label={f.label} value={fields[f.key]} />
                  ))}
                  {tags.length > 0 && <SummaryRow label="Interests" value={tags.join(", ")} />}
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--sd-text-muted)]">
                  <ShieldCheck className="h-3.5 w-3.5" /> Your password is hashed and never stored in plain text.
                </p>
                {error && <p className="mt-3 rounded-lg border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-7 flex items-center justify-between">
            {step > 0 ? (
              <button onClick={back} className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--sd-text-muted)] hover:text-[var(--sd-text)]">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <Link href="/login" className="text-sm font-medium text-[var(--sd-text-muted)] hover:text-[var(--sd-text)]">Sign in instead</Link>
            )}

            {step < steps.length - 1 ? (
              <button
                onClick={next}
                disabled={(step === 0 && !accountValid) || (step === 1 && !role) || (step === 2 && !identityValid)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (<><Loader2 className="h-4 w-4 animate-spin" /> Creating your workspace…</>) : (<>Create Account <Check className="h-4 w-4" /></>)}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass = "w-full rounded-lg border border-[var(--sd-border-strong)] bg-black/30 px-3 py-2 text-sm text-[var(--sd-text)] placeholder:text-[var(--sd-text-faint)] outline-none focus:border-[var(--sd-accent)] transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-[var(--sd-text-muted)]">{label}</span>
      {children}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-[var(--sd-text-muted)]">{label}</span>
      <span className="truncate font-medium text-[var(--sd-text)]">{value}</span>
    </div>
  );
}
