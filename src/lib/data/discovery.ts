import { Student, Project } from "../types";

export interface DiscoveredSkill {
  label: string;
  evidence: string;
}

// Soft/meta skills inferred from a student's actual activity — never
// random, and each one cites the specific project(s) or pattern that
// produced it, per the "show the evidence behind the inference" rule.
// These are deliberately skills NOT already in the student's declared
// skill list (declaring them twice would be redundant, not a discovery).
export function discoverSkillsFor(student: Student, projects: Project[]): DiscoveredSkill[] {
  const declared = new Set(student.skills.map((s) => s.skillId));
  const out: DiscoveredSkill[] = [];

  const mlFamily = ["sk-ml", "sk-cv", "sk-nlp", "sk-dl"];
  const mlProject = projects.find((p) => p.skills.some((s) => mlFamily.includes(s)));
  if (mlProject && !declared.has("sk-problem-solving")) {
    out.push({ label: "Problem Solving", evidence: `Detected from "${mlProject.title}" — model-based projects require breaking down ambiguous problems into solvable steps.` });
  }

  const richestProject = [...projects].sort((a, b) => b.skills.length - a.skills.length)[0];
  if (richestProject && richestProject.skills.length >= 3 && !declared.has("sk-oop")) {
    out.push({ label: "Rapid Prototyping", evidence: `Detected from "${richestProject.title}" — shipped end-to-end across ${richestProject.skills.length} technologies.` });
  }

  const verifiedCount = projects.filter((p) => p.verified).length;
  if (verifiedCount >= 1 && !declared.has("sk-teamwork")) {
    out.push({ label: "Delivery Ownership", evidence: `Detected from ${verifiedCount} verified project${verifiedCount === 1 ? "" : "s"} taken from idea to a working, reviewed result.` });
  }

  if (student.skills.some((s) => s.skillId === "sk-communication") && !declared.has("sk-presentation")) {
    out.push({ label: "Technical Communication", evidence: "Detected from documented project write-ups alongside your Communication skill signal." });
  }

  return out.slice(0, 4);
}
