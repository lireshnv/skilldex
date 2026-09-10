"use client";
import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, User } from "lucide-react";
import { Drawer } from "@/components/ui/drawer";
import { useSkillDexStore } from "@/lib/store";
import { PortalKey } from "@/lib/nav-config";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "ai";
  text: string;
}

const suggestions: Record<PortalKey, string[]> = {
  student: [
    "What should I learn today?",
    "Which companies fit me?",
    "Why is my readiness 72%?",
    "How can I become interview-ready?",
  ],
  faculty: [
    "What are our biggest skill gaps?",
    "Which companies should we approach?",
    "How can I increase my industry impact?",
  ],
  placement: [
    "What are our biggest skill gaps?",
    "Which companies should we approach?",
    "How can we improve placement readiness?",
  ],
  recruiter: [
    "Find candidates strong in React.",
    "Which colleges have the best AI talent?",
    "Summarize my open pipeline.",
  ],
  company: [
    "Find colleges with strong AI students.",
    "Help me create a hiring process.",
    "Which candidates match this role?",
  ],
};

function generateReply(portal: PortalKey, question: string): string {
  const q = question.toLowerCase();
  if (portal === "student") {
    if (q.includes("learn")) return "Based on your target role of Software Engineer, focus today on 30 minutes of DSA practice (arrays & recursion) and 1 SQL join exercise. This closes your two widest skill gaps first.";
    if (q.includes("compan")) return "Zoho, Freshworks and Razorpay currently show the strongest match to your skill profile — each above 80% fit based on your verified React and DSA evidence.";
    if (q.includes("readiness") || q.includes("72")) return "Your readiness score blends verified skill confidence (40%), project evidence (25%), assessment performance (20%) and profile completeness (15%). System Design is your biggest drag — improving it by 20 points would lift readiness by roughly 6 points.";
    if (q.includes("interview")) return "Complete 2 more mock interviews and close your System Design gap. Students who do both typically clear technical rounds 34% more often on SkillDex.";
    return "I can help you plan learning, find matching companies, explain your scores, or prep for interviews — what would you like to explore?";
  }
  if (portal === "faculty" || portal === "placement") {
    if (q.includes("gap")) return "The largest institutional gaps are Cloud Computing (62% of final-year students below target), DSA (48%) and workplace Communication (41%). A focused 4-week Cloud bootcamp is recommended.";
    if (q.includes("compan")) return "Based on hiring trends and skill demand, PhonePe, Innovate Labs and HealthBridge AI are strong outreach targets this quarter — all actively hiring for skills your students are strong in.";
    if (q.includes("improve") || q.includes("readiness")) return "Running 2 targeted bootcamps (Cloud Computing, System Design) and increasing mock interview frequency could raise overall placement readiness by an estimated 9-12 points this semester.";
    if (q.includes("impact")) return "Your expertise in Machine Learning and Computer Vision is in high demand — 3 companies are actively looking for faculty consultancy in this area right now.";
    return "Ask me about skill gaps, company outreach, or how to raise placement readiness across departments.";
  }
  if (portal === "recruiter") {
    if (q.includes("react")) return "18 candidates across 4 colleges show verified React proficiency above 80% confidence, with strong project evidence. Want me to open the filtered list?";
    if (q.includes("colleg")) return "R.V. College of Engineering and Vellore Institute of Technology currently lead in AI/ML talent depth, based on verified skill assessments and project evidence.";
    if (q.includes("pipeline")) return "Your pipeline has 34 active candidates: 12 in Screening, 9 in Assessment, 7 in Interview, 4 in Final, and 2 pending Offer decisions.";
    return "I can help you find candidates, compare colleges, or summarize your hiring pipeline.";
  }
  // company
  if (q.includes("colleg")) return "Based on AI talent depth, hackathon activity and industry engagement scores, Vellore Institute of Technology, R.V. College of Engineering and Manipal Institute of Technology are your best-fit collaboration targets.";
  if (q.includes("hiring") || q.includes("process")) return "I'd recommend a 4-stage process: Skill screening → Assessment → Technical interview → Culture round. Want me to pre-fill a job posting with this structure?";
  if (q.includes("candidate")) return "For a Frontend Engineer role, 22 verified candidates match above 75% — concentrated at BMS College of Engineering and R.V. College of Engineering.";
  return "Ask me to find colleges, build a hiring process, or match candidates to your open roles.";
}

export function AICopilot({ portal }: { portal: PortalKey }) {
  const open = useSkillDexStore((s) => s.aiCopilotOpen);
  const setOpen = useSkillDexStore((s) => s.setAiCopilotOpen);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hi! I'm the SkillDex AI Copilot. Ask me anything about skills, opportunities, or readiness — I'm using your live SkillDex data." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: generateReply(portal, text) }]);
      setTyping(false);
    }, 700);
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      title={
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-2" /> Ask SkillDex AI
        </span>
      }
      width={400}
    >
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex gap-2", m.role === "user" && "flex-row-reverse")}>
              <div className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                m.role === "ai" ? "bg-navy text-white" : "bg-surface-muted text-foreground"
              )}>
                {m.role === "ai" ? <Sparkles className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
              </div>
              <div className={cn(
                "max-w-[80%] rounded-[var(--radius-md)] px-3 py-2 text-sm leading-relaxed",
                m.role === "ai" ? "bg-surface-muted text-foreground" : "bg-blue text-white"
              )}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy text-white">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div className="flex items-center gap-1 rounded-[var(--radius-md)] bg-surface-muted px-3 py-2.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border p-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {suggestions[portal].map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-border-strong bg-surface px-2.5 py-1 text-[11px] text-muted-foreground hover:border-blue hover:text-blue-2 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask SkillDex AI..."
              className="h-10 flex-1 rounded-[var(--radius-md)] border border-border-strong bg-surface px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/40"
            />
            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-navy text-white hover:bg-navy-2 cursor-pointer"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </Drawer>
  );
}
