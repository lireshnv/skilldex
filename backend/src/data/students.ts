import { Student, StudentSkill } from "../types";
import { makeRng } from "./seed";
import { skills } from "./skills";
import { colleges } from "./colleges";

const firstNames = [
  "Arjun", "Priya", "Rahul", "Ananya", "Karthik", "Sneha", "Vikram", "Divya",
  "Aditya", "Meera", "Rohan", "Kavya", "Siddharth", "Ishita", "Nikhil", "Pooja",
  "Aryan", "Riya", "Varun", "Neha", "Kunal", "Shreya", "Abhishek", "Tanya",
  "Harsh", "Aditi", "Manish", "Nandini", "Yash", "Sanya",
];
const lastNames = [
  "Sharma", "Verma", "Iyer", "Reddy", "Nair", "Patel", "Gupta", "Menon",
  "Rao", "Joshi", "Kulkarni", "Singh", "Desai", "Pillai", "Chatterjee",
  "Mehta", "Agarwal", "Bhat", "Krishnan", "Kapoor",
];
const departments = ["CSE", "IT", "ECE", "AI & DS", "Mechanical"];
const targetRoles = [
  "Software Engineer", "Data Analyst", "ML Engineer", "Full Stack Developer",
  "Product Manager", "UI/UX Designer", "Cloud Engineer", "Data Scientist",
  "Backend Developer", "DevOps Engineer",
];
const bios = [
  "Passionate about building scalable web applications and solving real-world problems.",
  "Enjoys competitive programming and exploring machine learning research.",
  "Interested in product thinking and designing intuitive user experiences.",
  "Focused on cloud-native systems and distributed computing.",
  "Curious about AI ethics, data storytelling and analytics-driven decisions.",
];
const avatarPalette = ["#1d4ed8", "#0b1e3f", "#059669", "#7c3aed", "#d97706", "#0ea5e9", "#dc2626"];

const coreSkillPool = skills.map((s) => s.id);
const levels: StudentSkill["level"][] = ["Beginner", "Intermediate", "Advanced", "Expert"];

function genStudent(i: number): Student {
  const rng = makeRng(1000 + i * 7);
  const first = firstNames[i % firstNames.length];
  const last = lastNames[rng.int(0, lastNames.length - 1)];
  const college = rng.pick(colleges);
  const skillCount = rng.int(6, 11);
  const chosenSkills = rng.pickMany(coreSkillPool, skillCount);
  const studentSkills: StudentSkill[] = chosenSkills.map((skillId) => ({
    skillId,
    level: rng.pick(levels),
    confidence: rng.int(45, 97),
    evidenceCount: rng.int(0, 6),
    lastVerified: `2026-0${rng.int(1, 8)}-${String(rng.int(1, 27)).padStart(2, "0")}`,
  }));
  const readiness = rng.int(38, 96);
  return {
    id: `stu-${String(i + 1).padStart(2, "0")}`,
    name: `${first} ${last}`,
    avatarColor: rng.pick(avatarPalette),
    department: rng.pick(departments),
    college: college.name,
    collegeId: college.id,
    year: rng.int(2, 4),
    cgpa: Number(rng.float(6.2, 9.6).toFixed(2)),
    backlogs: rng.bool(0.8) ? 0 : rng.int(1, 2),
    targetRole: rng.pick(targetRoles),
    location: college.city,
    skills: studentSkills,
    readiness,
    industryMatch: rng.int(40, 97),
    profileStrength: rng.int(50, 98),
    projects: rng.int(1, 6),
    certifications: rng.int(0, 5),
    internships: rng.int(0, 3),
    offers: readiness > 85 ? rng.int(0, 2) : 0,
    bio: rng.pick(bios),
  };
}

export const students: Student[] = Array.from({ length: 30 }, (_, i) => genStudent(i));

export function studentById(id: string) {
  return students.find((s) => s.id === id);
}

export function readinessLabel(readiness: number): "Ready" | "Near Ready" | "Needs Development" {
  if (readiness >= 75) return "Ready";
  if (readiness >= 55) return "Near Ready";
  return "Needs Development";
}

// The demo "logged in" student used across the Student Portal
export const currentStudent = students[0];
