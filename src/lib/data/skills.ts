import { Skill, VerificationLevel } from "../types";

export const skills: Skill[] = [
  // Technical
  { id: "sk-python", name: "Python", category: "Technical", demand: 92 },
  { id: "sk-java", name: "Java", category: "Technical", demand: 84 },
  { id: "sk-js", name: "JavaScript", category: "Technical", demand: 88 },
  { id: "sk-ts", name: "TypeScript", category: "Technical", demand: 79 },
  { id: "sk-cpp", name: "C++", category: "Technical", demand: 68 },
  { id: "sk-dsa", name: "Data Structures & Algorithms", category: "Technical", demand: 95 },
  { id: "sk-sql", name: "SQL", category: "Technical", demand: 86 },
  { id: "sk-system-design", name: "System Design", category: "Technical", demand: 74 },
  { id: "sk-react", name: "React", category: "Technical", demand: 81 },
  { id: "sk-nodejs", name: "Node.js", category: "Technical", demand: 75 },
  { id: "sk-ml", name: "Machine Learning", category: "Technical", demand: 89 },
  { id: "sk-dl", name: "Deep Learning", category: "Technical", demand: 77 },
  { id: "sk-nlp", name: "NLP", category: "Technical", demand: 71 },
  { id: "sk-cv", name: "Computer Vision", category: "Technical", demand: 66 },
  { id: "sk-data-analytics", name: "Data Analytics", category: "Technical", demand: 83 },
  { id: "sk-cloud", name: "Cloud Computing", category: "Technical", demand: 87 },
  { id: "sk-aws", name: "AWS", category: "Technical", demand: 82 },
  { id: "sk-devops", name: "DevOps", category: "Technical", demand: 73 },
  { id: "sk-docker", name: "Docker & Kubernetes", category: "Technical", demand: 70 },
  { id: "sk-cyber", name: "Cybersecurity", category: "Technical", demand: 76 },
  { id: "sk-blockchain", name: "Blockchain", category: "Technical", demand: 48 },
  { id: "sk-iot", name: "IoT", category: "Technical", demand: 54 },
  { id: "sk-android", name: "Android Development", category: "Technical", demand: 62 },
  { id: "sk-flutter", name: "Flutter", category: "Technical", demand: 58 },
  { id: "sk-uiux", name: "UI/UX Design", category: "Technical", demand: 69 },
  { id: "sk-testing", name: "Software Testing", category: "Technical", demand: 61 },
  { id: "sk-dbms", name: "DBMS", category: "Technical", demand: 72 },
  { id: "sk-mongodb", name: "MongoDB", category: "Technical", demand: 64 },
  { id: "sk-os", name: "Operating Systems", category: "Technical", demand: 60 },
  { id: "sk-cn", name: "Computer Networks", category: "Technical", demand: 57 },
  { id: "sk-oop", name: "OOP Design", category: "Technical", demand: 65 },
  // Tools
  { id: "sk-git", name: "Git & GitHub", category: "Tools", demand: 80 },
  { id: "sk-figma", name: "Figma", category: "Tools", demand: 55 },
  { id: "sk-excel", name: "Advanced Excel", category: "Tools", demand: 63 },
  { id: "sk-powerbi", name: "Power BI", category: "Tools", demand: 59 },
  { id: "sk-tableau", name: "Tableau", category: "Tools", demand: 56 },
  { id: "sk-jira", name: "Jira / Agile Tools", category: "Tools", demand: 47 },
  // Domain
  { id: "sk-fintech", name: "FinTech Domain", category: "Domain", demand: 52 },
  { id: "sk-healthtech", name: "HealthTech Domain", category: "Domain", demand: 46 },
  { id: "sk-supplychain", name: "Supply Chain", category: "Domain", demand: 41 },
  { id: "sk-digitalmarketing", name: "Digital Marketing", category: "Domain", demand: 58 },
  { id: "sk-productmgmt", name: "Product Management", category: "Domain", demand: 64 },
  { id: "sk-consulting", name: "Business Consulting", category: "Domain", demand: 49 },
  // Soft skills
  { id: "sk-communication", name: "Communication", category: "Soft Skill", demand: 90 },
  { id: "sk-leadership", name: "Leadership", category: "Soft Skill", demand: 68 },
  { id: "sk-teamwork", name: "Teamwork & Collaboration", category: "Soft Skill", demand: 85 },
  { id: "sk-problem-solving", name: "Problem Solving", category: "Soft Skill", demand: 88 },
  { id: "sk-time-mgmt", name: "Time Management", category: "Soft Skill", demand: 62 },
  { id: "sk-presentation", name: "Presentation Skills", category: "Soft Skill", demand: 60 },
  { id: "sk-negotiation", name: "Negotiation", category: "Soft Skill", demand: 44 },
  { id: "sk-critical-thinking", name: "Critical Thinking", category: "Soft Skill", demand: 71 },
  { id: "sk-adaptability", name: "Adaptability", category: "Soft Skill", demand: 66 },
];

export function skillById(id: string) {
  return skills.find((s) => s.id === id);
}

export function skillName(id: string) {
  return skillById(id)?.name ?? id;
}

// Deterministic from evidenceCount alone — no randomness — so the same
// skill always reports the same verification level everywhere it's shown.
// This is deliberately a step above "raw confidence": a student can rate
// themselves Advanced at something with zero evidence, which is exactly
// why this exists as a separate axis (see VerificationLevel in types.ts).
export function verificationFor(evidenceCount: number, confidence: number): VerificationLevel {
  if (evidenceCount <= 0) return "Self Declared";
  if (evidenceCount <= 2) return "Assessed";
  if (evidenceCount <= 4) return confidence >= 80 ? "Faculty Verified" : "Project Verified";
  return confidence >= 80 ? "Industry Verified" : "Faculty Verified";
}
