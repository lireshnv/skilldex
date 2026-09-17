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
    ];
  },
};

export default nextConfig;
