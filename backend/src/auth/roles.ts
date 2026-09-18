export const ROLES = ["student", "faculty", "institution_admin", "industry", "recruiter"] as const;
export type Role = (typeof ROLES)[number];

export function isRole(v: unknown): v is Role {
  return typeof v === "string" && (ROLES as readonly string[]).includes(v);
}

// The "necessary ID" field set differs per role — this is the single source
// of truth the register endpoint validates against and the profile table
// each role's row lives in.
export const roleFieldSpecs: Record<Role, { table: string; idColumn: string; required: string[] }> = {
  student: { table: "student_profiles", idColumn: "student_id", required: ["studentId", "institution"] },
  faculty: { table: "faculty_profiles", idColumn: "faculty_id", required: ["facultyId", "institution"] },
  institution_admin: { table: "institution_profiles", idColumn: "institution_id", required: ["institutionId", "institutionName"] },
  industry: { table: "industry_profiles", idColumn: "company_id", required: ["companyId", "companyName"] },
  recruiter: { table: "recruiter_profiles", idColumn: "recruiter_id", required: ["recruiterId", "company"] },
};

export const roleDashboard: Record<Role, string> = {
  student: "/institution/student",
  faculty: "/institution/faculty",
  institution_admin: "/institution/placement",
  industry: "/industry/company",
  recruiter: "/industry/recruiter",
};

export const roleTagOptions: Record<Role, string[]> = {
  student: ["AI / ML", "Data Science", "Web Development", "Cloud", "Cybersecurity", "IoT", "Software Development", "Research", "Entrepreneurship"],
  faculty: ["AI / ML", "Research", "Industry Training", "Mentorship", "Consultancy", "FDP", "Guest Lectures"],
  institution_admin: ["Placements", "Curriculum", "Industry Relations", "Analytics"],
  industry: ["Hiring", "Internships", "Research", "Projects", "Consultancy", "Hackathons", "Training", "Industry Collaboration"],
  recruiter: ["Hiring", "Internships", "Campus Drives", "Technical Roles", "Bulk Hiring"],
};
