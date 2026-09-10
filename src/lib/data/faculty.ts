import { Faculty } from "../types";
import { makeRng } from "./seed";
import { colleges } from "./colleges";

const names = [
  "Dr. Ramesh Chandran", "Dr. Lakshmi Narayan", "Dr. Suresh Babu", "Dr. Anjali Deshmukh",
  "Dr. Vinod Kumar", "Dr. Kavitha Raman", "Dr. Sanjay Malhotra", "Dr. Deepa Krishnan",
  "Dr. Prakash Iyer", "Dr. Shalini Menon", "Dr. Arvind Bhatt", "Dr. Nalini Rao",
  "Dr. Mahesh Pillai", "Dr. Rekha Sundaram", "Dr. Girish Kulkarni",
];
const titles = ["Associate Professor", "Professor", "Assistant Professor"];
const expertiseSets = [
  ["Machine Learning", "Computer Vision", "Data Science"],
  ["Cloud Computing", "DevOps", "Distributed Systems"],
  ["IoT", "Embedded Systems", "Robotics"],
  ["Cybersecurity", "Network Security", "Cryptography"],
  ["NLP", "Deep Learning", "AI Ethics"],
  ["Data Analytics", "Business Intelligence", "Statistics"],
  ["Software Engineering", "System Design", "Agile Methods"],
  ["Blockchain", "FinTech", "Distributed Ledgers"],
];
const bios = [
  "Works closely with industry on applied research and student mentorship.",
  "Leads multiple funded research projects with strong industry collaboration.",
  "Focused on bridging classroom learning with real-world engineering practice.",
  "Active in consultancy engagements and faculty development programs.",
];
const avatarPalette = ["#1d4ed8", "#0b1e3f", "#059669", "#7c3aed", "#d97706"];

export const faculty: Faculty[] = names.map((name, i) => {
  const rng = makeRng(500 + i * 11);
  const college = rng.pick(colleges);
  return {
    id: `fac-${String(i + 1).padStart(2, "0")}`,
    name,
    avatarColor: rng.pick(avatarPalette),
    department: rng.pick(college.departments),
    college: college.name,
    title: rng.pick(titles),
    expertise: rng.pick(expertiseSets),
    studentsMentored: rng.int(15, 120),
    publications: rng.int(3, 42),
    industryConnections: rng.int(2, 18),
    bio: rng.pick(bios),
  };
});

export function facultyById(id: string) {
  return faculty.find((f) => f.id === id);
}

export const currentFaculty = faculty[0];
