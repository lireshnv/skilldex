import {
  LayoutDashboard, IdCard, ClipboardCheck, Share2, BookOpen, CalendarClock,
  FolderKanban, Briefcase, FileStack, MessageSquareText,
  Video, Users, Route, Building2, Bell, Settings, Lightbulb, FlaskConical,
  HandCoins, Mic, HeartHandshake, Users2, TrendingUp, Network, Search,
  UserSearch, PlusCircle, KanbanSquare, CalendarCheck2, Rocket, Trophy,
  BadgeCheck, LineChart, School, GitBranch,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

export const studentNav: NavItem[] = [
  { label: "Dashboard", href: "/institution/student", icon: LayoutDashboard },
  { label: "Skill Passport", href: "/institution/student/skill-passport", icon: IdCard },
  { label: "Skill Assessment", href: "/institution/student/assessment", icon: ClipboardCheck },
  { label: "Skill Graph", href: "/institution/student/skill-graph", icon: Share2 },
  { label: "Daily AI Plan", href: "/institution/student/daily-plan", icon: CalendarClock },
  { label: "Learning", href: "/institution/student/learning", icon: BookOpen },
  { label: "Projects", href: "/institution/student/projects", icon: FolderKanban },
  { label: "Internships", href: "/institution/student/internships", icon: Briefcase },
  { label: "Jobs", href: "/institution/student/jobs", icon: FileStack },
  { label: "Applications", href: "/institution/student/applications", icon: ClipboardCheck },
  { label: "Interview Prep", href: "/institution/student/interview-prep", icon: MessageSquareText },
  { label: "Mock Interview", href: "/institution/student/mock-interview", icon: Video },
  { label: "Alumni & Mentors", href: "/institution/student/alumni", icon: Users },
  { label: "Career Paths", href: "/institution/student/career-paths", icon: Route },
  { label: "Company Explorer", href: "/institution/student/companies", icon: Building2 },
  { label: "Eligibility", href: "/institution/student/eligibility", icon: BadgeCheck },
  { label: "Notifications", href: "/institution/student/notifications", icon: Bell },
  { label: "Settings", href: "/institution/student/settings", icon: Settings },
];

export const facultyNav: NavItem[] = [
  { label: "Dashboard", href: "/institution/faculty", icon: LayoutDashboard },
  { label: "Expertise Graph", href: "/institution/faculty/expertise", icon: Network },
  { label: "FDP Opportunities", href: "/institution/faculty/fdp", icon: Lightbulb },
  { label: "Industrial Training", href: "/institution/faculty/industrial-training", icon: FlaskConical },
  { label: "Research", href: "/institution/faculty/research", icon: FlaskConical },
  { label: "Consultancy", href: "/institution/faculty/consultancy", icon: HandCoins },
  { label: "Guest Lectures", href: "/institution/faculty/guest-lectures", icon: Mic },
  { label: "Mentorship", href: "/institution/faculty/mentorship", icon: HeartHandshake },
  { label: "Notifications", href: "/institution/faculty/notifications", icon: Bell },
];

export const placementNav: NavItem[] = [
  { label: "Command Center", href: "/institution/placement", icon: LayoutDashboard },
  { label: "Skill Gap Analytics", href: "/institution/placement/skill-gaps", icon: TrendingUp },
  { label: "Resource Intelligence", href: "/institution/placement/resources", icon: FolderKanban },
  { label: "Company Relations", href: "/institution/placement/companies", icon: Building2 },
  { label: "Company Discovery", href: "/institution/placement/company-discovery", icon: Search },
  { label: "Analytics", href: "/institution/placement/analytics", icon: LineChart },
  { label: "Notifications", href: "/institution/placement/notifications", icon: Bell },
];

export const recruiterNav: NavItem[] = [
  { label: "Dashboard", href: "/industry/recruiter", icon: LayoutDashboard },
  { label: "Talent Discovery", href: "/industry/recruiter/talent", icon: UserSearch },
  { label: "Jobs", href: "/industry/recruiter/jobs", icon: Briefcase },
  { label: "Post a Job", href: "/industry/recruiter/jobs/new", icon: PlusCircle },
  { label: "Pipeline", href: "/industry/recruiter/pipeline", icon: KanbanSquare },
  { label: "Interviews", href: "/industry/recruiter/interviews", icon: CalendarCheck2 },
];

export const companyNav: NavItem[] = [
  { label: "Collaboration Hub", href: "/industry/company", icon: LayoutDashboard },
  { label: "College Discovery", href: "/industry/company/colleges", icon: School },
  { label: "Opportunities", href: "/industry/company/opportunities", icon: FileStack },
  { label: "Post Opportunity", href: "/industry/company/opportunities/new", icon: PlusCircle },
  { label: "Startup Assistant", href: "/industry/company/startup-assistant", icon: Rocket },
  { label: "Collaborations", href: "/industry/company/collaborations", icon: GitBranch },
  { label: "Hackathons", href: "/industry/company/hackathons", icon: Trophy },
  { label: "Faculty Network", href: "/industry/company/faculty", icon: Users2 },
  { label: "Analytics", href: "/industry/company/analytics", icon: LineChart },
];

export type PortalKey = "student" | "faculty" | "placement" | "recruiter" | "company";

export const portalMeta: Record<PortalKey, { title: string; nav: NavItem[]; org: string; switchHref: string }> = {
  student: { title: "Student Portal", nav: studentNav, org: "Vishwakarma Institute of Technology", switchHref: "/institution" },
  faculty: { title: "Faculty Portal", nav: facultyNav, org: "Vishwakarma Institute of Technology", switchHref: "/institution" },
  placement: { title: "Placement Cell", nav: placementNav, org: "Vishwakarma Institute of Technology", switchHref: "/institution" },
  recruiter: { title: "Recruiter Portal", nav: recruiterNav, org: "Talent Acquisition", switchHref: "/industry" },
  company: { title: "Industry Portal", nav: companyNav, org: "Industry Collaboration", switchHref: "/industry" },
};
