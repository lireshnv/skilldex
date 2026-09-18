import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Old routes from before the IA consolidation pass — kept as redirects so
  // no existing bookmark/link 404s, even though the sidebar no longer lists
  // these separately (their content lives as tabs on the destination page).
  async redirects() {
    return [
      { source: "/institution/faculty/fdp", destination: "/institution/faculty/industry", permanent: true },
      { source: "/institution/faculty/industrial-training", destination: "/institution/faculty/industry", permanent: true },
      { source: "/institution/faculty/guest-lectures", destination: "/institution/faculty/industry", permanent: true },
      { source: "/institution/faculty/consultancy", destination: "/institution/faculty/industry", permanent: true },
      { source: "/institution/placement/companies", destination: "/institution/placement/industry-relations", permanent: true },
      { source: "/institution/placement/company-discovery", destination: "/institution/placement/industry-relations", permanent: true },
      { source: "/industry/company/hackathons", destination: "/industry/company/opportunities", permanent: true },
      { source: "/institution/student/internships", destination: "/institution/student/opportunities", permanent: true },
      { source: "/institution/student/jobs", destination: "/institution/student/opportunities", permanent: true },

      // Student portal deep IA consolidation (Overview/Skills/Career/Opportunities/Growth/Community)
      { source: "/institution/student/skill-passport", destination: "/institution/student/skills", permanent: true },
      { source: "/institution/student/assessment", destination: "/institution/student/skills", permanent: true },
      { source: "/institution/student/skill-graph", destination: "/institution/student/skills?tab=graph", permanent: true },
      { source: "/institution/student/career-paths", destination: "/institution/student/career", permanent: true },
      { source: "/institution/student/eligibility", destination: "/institution/student/career", permanent: true },
      { source: "/institution/student/companies", destination: "/institution/student/career", permanent: true },
      { source: "/institution/student/applications", destination: "/institution/student/opportunities?tab=applications", permanent: true },
      { source: "/institution/student/daily-plan", destination: "/institution/student/growth", permanent: true },
      { source: "/institution/student/learning", destination: "/institution/student/growth", permanent: true },
      { source: "/institution/student/projects", destination: "/institution/student/growth", permanent: true },
      { source: "/institution/student/interview-prep", destination: "/institution/student/growth", permanent: true },
      { source: "/institution/student/alumni", destination: "/institution/student/community", permanent: true },
      { source: "/institution/student/leaderboard", destination: "/institution/student/community", permanent: true },
    ];
  },
};

export default nextConfig;
