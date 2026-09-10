import { Job } from "../types";
import { makeRng } from "./seed";
import { companies } from "./companies";

const ftTitles = [
  "Software Engineer", "Backend Developer", "Frontend Developer", "Full Stack Developer",
  "Data Analyst", "Data Scientist", "ML Engineer", "Cloud Engineer", "DevOps Engineer",
  "QA Engineer", "Product Analyst", "Associate Consultant", "Systems Engineer",
];
const internTitles = [
  "Software Engineering Intern", "Data Science Intern", "Frontend Intern",
  "Backend Intern", "ML Research Intern", "Product Intern", "Cloud Intern",
  "Design Intern", "Analytics Intern",
];
const projectTitles = [
  "Smart Campus Energy Optimization", "Fraud Detection Model for Payments",
  "Customer Churn Prediction Dashboard", "Inventory Forecasting Engine",
  "Accessible UI Component Library", "IoT-based Crop Monitoring System",
];
const hackathonTitles = [
  "Campus FinTech Hackathon", "AI for Good Hackathon", "48-Hour Build Sprint",
  "CloudNative Hack Days",
];
const workshopTitles = [
  "Cloud Architecture Bootcamp", "System Design Masterclass", "DSA Problem Solving Workshop",
  "Product Thinking Workshop",
];
const mentorshipTitles = ["Career Mentorship Circle", "Technical Mentorship Program"];
const researchTitles = ["Applied ML Research Collaboration", "Edge Computing Research Program"];
const consultancyTitles = ["Digital Transformation Consultancy", "Data Strategy Advisory Engagement"];

const departments = ["CSE", "IT", "ECE", "AI & DS", "Mechanical"];
const locations = ["Bengaluru", "Chennai", "Pune", "Hyderabad", "Gurugram", "Remote"];

function eligibility(rng: ReturnType<typeof makeRng>) {
  return {
    minCgpa: Number(rng.float(6.0, 7.8).toFixed(1)),
    maxBacklogs: rng.pick([0, 0, 1]),
    departments: rng.pickMany(departments, rng.int(2, 4)),
    years: rng.pick([[3, 4], [2, 3, 4], [4]]),
  };
}

let counter = 1;
function nextId() {
  return `job-${String(counter++).padStart(3, "0")}`;
}

function buildJobs(): Job[] {
  const out: Job[] = [];
  const rng = makeRng(2024);

  ftTitles.forEach((title, i) => {
    const company = companies[i % companies.length];
    out.push({
      id: nextId(),
      companyId: company.id,
      title,
      type: "Full-time",
      requiredSkills: rng.pickMany(company.requiredSkills.concat(["sk-communication", "sk-problem-solving"]), 4),
      location: rng.pick(locations),
      package: `${company.avgPackage} LPA`,
      deadline: `2026-${String(rng.int(9, 12)).padStart(2, "0")}-${String(rng.int(5, 27)).padStart(2, "0")}`,
      eligibility: eligibility(rng),
      description: `Join ${company.name} as a ${title} and work on production-grade systems used by millions of users.`,
      status: "Open",
    });
  });

  internTitles.forEach((title, i) => {
    const company = companies[(i + 5) % companies.length];
    out.push({
      id: nextId(),
      companyId: company.id,
      title,
      type: "Internship",
      requiredSkills: rng.pickMany(company.requiredSkills, 3),
      location: rng.pick(locations),
      package: `${rng.int(15, 80)}k/month`,
      deadline: `2026-${String(rng.int(9, 12)).padStart(2, "0")}-${String(rng.int(5, 27)).padStart(2, "0")}`,
      eligibility: eligibility(rng),
      description: `A hands-on internship at ${company.name} working alongside senior engineers on live projects.`,
      status: "Open",
    });
  });

  // extra internships to reach 20
  for (let i = 0; i < 11; i++) {
    const company = companies[(i + 9) % companies.length];
    out.push({
      id: nextId(),
      companyId: company.id,
      title: rng.pick(internTitles),
      type: "Internship",
      requiredSkills: rng.pickMany(company.requiredSkills, 3),
      location: rng.pick(locations),
      package: `${rng.int(15, 80)}k/month`,
      deadline: `2026-${String(rng.int(9, 12)).padStart(2, "0")}-${String(rng.int(5, 27)).padStart(2, "0")}`,
      eligibility: eligibility(rng),
      description: `Internship opportunity at ${company.name} focused on real product impact.`,
      status: "Open",
    });
  }

  projectTitles.forEach((title, i) => {
    const company = companies[(i + 3) % companies.length];
    out.push({ id: nextId(), companyId: company.id, title, type: "Live Project", requiredSkills: rng.pickMany(company.requiredSkills, 3), location: "Remote", package: "Stipend + Certificate", deadline: `2026-${String(rng.int(9, 12)).padStart(2, "0")}-15`, eligibility: eligibility(rng), description: `Collaborate with ${company.name} on a live industry project with faculty guidance.`, status: "Open" });
  });

  hackathonTitles.forEach((title, i) => {
    const company = companies[(i + 7) % companies.length];
    out.push({ id: nextId(), companyId: company.id, title, type: "Hackathon", requiredSkills: rng.pickMany(company.requiredSkills, 3), location: rng.pick(locations), package: "Prizes up to ₹2,00,000", deadline: `2026-${String(rng.int(9, 11)).padStart(2, "0")}-20`, eligibility: eligibility(rng), description: `A 48-hour hackathon hosted by ${company.name} for student innovators.`, status: "Open" });
  });

  workshopTitles.forEach((title, i) => {
    const company = companies[(i + 2) % companies.length];
    out.push({ id: nextId(), companyId: company.id, title, type: "Workshop", requiredSkills: rng.pickMany(company.requiredSkills, 2), location: rng.pick(locations), package: "Free", deadline: `2026-${String(rng.int(9, 11)).padStart(2, "0")}-10`, eligibility: eligibility(rng), description: `A hands-on workshop by ${company.name} engineers.`, status: "Open" });
  });

  mentorshipTitles.forEach((title, i) => {
    const company = companies[(i + 4) % companies.length];
    out.push({ id: nextId(), companyId: company.id, title, type: "Mentorship", requiredSkills: rng.pickMany(company.requiredSkills, 2), location: "Remote", package: "Unpaid", deadline: `2026-${String(rng.int(9, 12)).padStart(2, "0")}-01`, eligibility: eligibility(rng), description: `Structured mentorship program connecting students with ${company.name} professionals.`, status: "Open" });
  });

  researchTitles.forEach((title, i) => {
    const company = companies[(i + 6) % companies.length];
    out.push({ id: nextId(), companyId: company.id, title, type: "Research", requiredSkills: rng.pickMany(company.requiredSkills, 3), location: "Hybrid", package: "Research Grant", deadline: `2026-${String(rng.int(9, 12)).padStart(2, "0")}-01`, eligibility: eligibility(rng), description: `Joint research collaboration with ${company.name} R&D team.`, status: "Open" });
  });

  consultancyTitles.forEach((title, i) => {
    const company = companies[(i + 8) % companies.length];
    out.push({ id: nextId(), companyId: company.id, title, type: "Consultancy", requiredSkills: rng.pickMany(company.requiredSkills, 3), location: "Hybrid", package: "Consulting Fee", deadline: `2026-${String(rng.int(9, 12)).padStart(2, "0")}-01`, eligibility: eligibility(rng), description: `Faculty-led consultancy engagement with ${company.name}.`, status: "Open" });
  });

  return out;
}

export const jobs: Job[] = buildJobs();

export function jobById(id: string) {
  return jobs.find((j) => j.id === id);
}

export const fullTimeAndInternJobs = jobs.filter((j) => j.type === "Full-time" || j.type === "Internship");
