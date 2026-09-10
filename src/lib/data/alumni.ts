import { AlumniProfile } from "../types";
import { makeRng } from "./seed";
import { companies } from "./companies";

const names = [
  "Amit Trivedi", "Sowmya Ramesh", "Rajeev Nanda", "Preethi Shankar", "Vishal Oberoi",
  "Nisha Kohli", "Suraj Patil", "Anusha Reddy", "Deepak Suri", "Kirti Bhalla",
  "Gaurav Chawla", "Lavanya Shetty", "Tarun Sehgal", "Snehal Joshi", "Manoj Pillai",
  "Aparna Iyengar", "Rohit Bajaj", "Swati Agnihotri", "Naveen Kumar", "Pallavi Mishra",
];
const roles = [
  "Software Development Engineer II", "Senior Data Scientist", "Product Manager",
  "Engineering Manager", "Backend Engineer", "Cloud Architect", "UX Lead",
  "ML Engineer", "DevOps Lead", "Founder & CEO",
];
const expertiseSets = [
  ["System Design", "Interview Prep", "Backend"],
  ["Data Science", "ML", "Career Transitions"],
  ["Product Strategy", "Leadership"],
  ["Cloud", "DevOps", "System Design"],
  ["Frontend", "UI/UX", "Design Systems"],
  ["Startups", "Fundraising", "Product-Market Fit"],
];
const departments = ["CSE", "IT", "ECE", "AI & DS", "Mechanical"];
const avatarPalette = ["#1d4ed8", "#0b1e3f", "#059669", "#7c3aed", "#d97706", "#0ea5e9"];

export const alumni: AlumniProfile[] = names.map((name, i) => {
  const rng = makeRng(800 + i * 13);
  return {
    id: `alm-${String(i + 1).padStart(2, "0")}`,
    name,
    avatarColor: rng.pick(avatarPalette),
    gradYear: rng.int(2016, 2023),
    department: rng.pick(departments),
    company: rng.pick(companies).name,
    role: rng.pick(roles),
    experience: rng.int(2, 10),
    expertise: rng.pick(expertiseSets),
    bio: "Happy to help juniors with interview prep, resume reviews and career guidance.",
  };
});

export function alumniById(id: string) {
  return alumni.find((a) => a.id === id);
}
