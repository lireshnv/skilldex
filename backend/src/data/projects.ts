import { Project } from "../types";
import { makeRng } from "./seed";
import { students } from "./students";

const titles = [
  "Real-time Chat Application", "E-commerce Recommendation Engine", "Campus Event Management System",
  "Personal Finance Tracker", "Resume Parser using NLP", "Smart Attendance System (Face Recognition)",
  "Food Delivery Clone (Full Stack)", "Stock Price Prediction Model", "Hostel Management Portal",
  "Plagiarism Detection Tool", "Job Portal with Skill Matching", "Traffic Sign Recognition (CV)",
  "Expense Splitting App", "Library Management System", "Fitness Tracking Mobile App",
  "Sentiment Analysis Dashboard", "Blockchain-based Voting System", "IoT Home Automation",
  "Movie Recommendation System", "Portfolio Website Generator",
];
const skillSets = [
  ["sk-react", "sk-nodejs", "sk-sql"], ["sk-python", "sk-ml", "sk-data-analytics"],
  ["sk-java", "sk-sql", "sk-oop"], ["sk-js", "sk-react", "sk-css" as string],
  ["sk-python", "sk-nlp"], ["sk-python", "sk-cv", "sk-ml"],
];

export const projects: Project[] = titles.map((title, i) => {
  const rng = makeRng(1500 + i * 5);
  const student = rng.pick(students);
  return {
    id: `prj-${String(i + 1).padStart(2, "0")}`,
    studentId: student.id,
    title,
    skills: rng.pick(skillSets).filter(Boolean),
    description: `Built as part of academic coursework and personal learning, focused on practical application of ${title.toLowerCase()}.`,
    verified: rng.bool(0.65),
  };
});

// Liresh's (stu-01) signature project — matches his Python/ML/CV skills and
// ML Engineer target role, per the coherent demo story.
projects.push({
  id: "prj-21",
  studentId: "stu-01",
  title: "Smart Crop Disease Detection",
  skills: ["sk-python", "sk-ml", "sk-cv"],
  description: "A computer vision model that identifies crop diseases from leaf images to help farmers act early, trained on an open agricultural image dataset.",
  verified: true,
});

export function projectsByStudent(studentId: string) {
  return projects.filter((p) => p.studentId === studentId);
}
