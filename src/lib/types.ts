export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

// How a skill's confidence score was substantiated — separate from
// SkillLevel (which is a proficiency estimate). A student can be "Advanced"
// at a skill that's still only Self Declared; verification is about
// evidence, not raw ability.
export type VerificationLevel = "Self Declared" | "Assessed" | "Project Verified" | "Faculty Verified" | "Industry Verified";

export interface Skill {
  id: string;
  name: string;
  category: "Technical" | "Tools" | "Soft Skill" | "Domain";
  demand: number; // 0-100 industry demand
}

export interface StudentSkill {
  skillId: string;
  level: SkillLevel;
  confidence: number; // 0-100
  evidenceCount: number;
  lastVerified: string;
  verification: VerificationLevel;
}

export interface Student {
  id: string;
  name: string;
  avatarColor: string;
  department: string;
  college: string;
  collegeId: string;
  year: number;
  cgpa: number;
  backlogs: number;
  targetRole: string;
  location: string;
  skills: StudentSkill[];
  readiness: number;
  industryMatch: number;
  profileStrength: number;
  projects: number;
  certifications: number;
  internships: number;
  offers: number;
  bio: string;
}

export interface Faculty {
  id: string;
  name: string;
  avatarColor: string;
  department: string;
  college: string;
  title: string;
  expertise: string[];
  studentsMentored: number;
  publications: number;
  industryConnections: number;
  bio: string;
}

export interface College {
  id: string;
  name: string;
  city: string;
  state: string;
  departments: string[];
  totalStudents: number;
  placementRate: number;
  topSkills: string[];
  hackathons: number;
  startupParticipation: number;
  industryEngagementScore: number;
  logoColor: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: "Startup" | "Mid-size" | "Enterprise";
  location: string;
  logoColor: string;
  hiringStatus: "Actively Hiring" | "Selective" | "Paused";
  avgPackage: number; // LPA
  requiredSkills: string[];
  openRoles: number;
  about: string;
  relationshipScore: number;
  history: { year: string; hires: number; internships: number }[];
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  type: "Full-time" | "Internship" | "Live Project" | "Hackathon" | "Workshop" | "Mentorship" | "Research" | "Consultancy";
  requiredSkills: string[];
  location: string;
  package: string;
  deadline: string;
  eligibility: { minCgpa: number; maxBacklogs: number; departments: string[]; years: number[] };
  description: string;
  status: "Open" | "Closed";
}

export interface ApplicationRecord {
  id: string;
  studentId: string;
  jobId: string;
  stage: "Applied" | "Screened" | "Shortlisted" | "Assessment" | "Interview" | "Final" | "Offer" | "Hired" | "Rejected";
  appliedOn: string;
  matchScore: number;
}

export interface Project {
  id: string;
  studentId: string;
  title: string;
  skills: string[];
  description: string;
  verified: boolean;
}

export interface AssessmentDef {
  id: string;
  title: string;
  category: "Technical" | "Aptitude" | "Soft Skills" | "Domain";
  skillId: string;
  questionCount: number;
  duration: number; // minutes
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

export interface AssessmentResult {
  id: string;
  studentId: string;
  assessmentId: string;
  score: number;
  accuracy: number;
  takenOn: string;
  strengths: string[];
  weaknesses: string[];
}

export interface AlumniProfile {
  id: string;
  name: string;
  avatarColor: string;
  gradYear: number;
  department: string;
  company: string;
  role: string;
  experience: number;
  expertise: string[];
  bio: string;
}

export interface Notification {
  id: string;
  audience: "student" | "faculty" | "placement" | "recruiter" | "company";
  title: string;
  body: string;
  time: string;
  read: boolean;
  kind: "info" | "success" | "warning";
}

export interface Candidate extends Student {
  readinessLabel: "Ready" | "Near Ready" | "Needs Development";
}
