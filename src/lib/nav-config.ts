import {
  LayoutDashboard, IdCard, ClipboardCheck, Share2, BookOpen, CalendarClock,
  FolderKanban, Briefcase, FileStack, MessageSquareText,
  Video, Users, Route, Building2, Bell, Settings, Lightbulb, FlaskConical,
  HeartHandshake, Users2, TrendingUp, Network,
  UserSearch, PlusCircle, KanbanSquare, CalendarCheck2, Rocket,
  BadgeCheck, LineChart, School, GitBranch, Flame,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

// Every portal's nav is grouped into a few labeled sections instead of one
// long flat list — same routes as before (nothing moved, nothing deleted),
// just organized so the sidebar reads as "important things, grouped" rather
// than 15-20 items in a row. Groups with a single item (e.g. "Workspace")
// render without a repeated section label — see Sidebar.
export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const studentNav: NavGroup[] = [
  { label: "Workspace", items: [
    { label: "Dashboard", href: "/institution/student", icon: LayoutDashboard },
  ] },
  { label: "My Skills", items: [
    { label: "Skill Passport", href: "/institution/student/skill-passport", icon: IdCard },
    { label: "Skill Assessment", href: "/institution/student/assessment", icon: ClipboardCheck },
    { label: "Skill Graph", href: "/institution/student/skill-graph", icon: Share2 },
  ] },
  { label: "Career", items: [
    { label: "Career Paths", href: "/institution/student/career-paths", icon: Route },
    { label: "Company Explorer", href: "/institution/student/companies", icon: Building2 },
    { label: "Eligibility", href: "/institution/student/eligibility", icon: BadgeCheck },
  ] },
  { label: "Opportunities", items: [
    { label: "Opportunities", href: "/institution/student/opportunities", icon: Briefcase },
    { label: "Applications", href: "/institution/student/applications", icon: ClipboardCheck },
  ] },
  { label: "Learn & Build", items: [
    { label: "Daily Plan", href: "/institution/student/daily-plan", icon: CalendarClock },
    { label: "Learning", href: "/institution/student/learning", icon: BookOpen },
    { label: "Projects", href: "/institution/student/projects", icon: FolderKanban },
  ] },
  { label: "Prepare", items: [
    { label: "Interview Prep", href: "/institution/student/interview-prep", icon: MessageSquareText },
    { label: "Mock Interview", href: "/institution/student/mock-interview", icon: Video },
  ] },
  { label: "Community", items: [
    { label: "Alumni & Mentors", href: "/institution/student/alumni", icon: Users },
    { label: "Leaderboard", href: "/institution/student/leaderboard", icon: Flame },
  ] },
  { label: "", items: [
    { label: "Notifications", href: "/institution/student/notifications", icon: Bell },
    { label: "Settings", href: "/institution/student/settings", icon: Settings },
  ] },
];

export const facultyNav: NavGroup[] = [
  { label: "Workspace", items: [
    { label: "Dashboard", href: "/institution/faculty", icon: LayoutDashboard },
  ] },
  { label: "Expertise", items: [
    { label: "Expertise Graph", href: "/institution/faculty/expertise", icon: Network },
  ] },
  { label: "Industry", items: [
    { label: "Industry Engagement", href: "/institution/faculty/industry", icon: Lightbulb },
  ] },
  { label: "Research", items: [
    { label: "Research", href: "/institution/faculty/research", icon: FlaskConical },
  ] },
  { label: "Students", items: [
    { label: "Mentorship", href: "/institution/faculty/mentorship", icon: HeartHandshake },
  ] },
  { label: "", items: [
    { label: "Notifications", href: "/institution/faculty/notifications", icon: Bell },
  ] },
];

export const placementNav: NavGroup[] = [
  { label: "Workspace", items: [
    { label: "Command Center", href: "/institution/placement", icon: LayoutDashboard },
  ] },
  { label: "Student Intelligence", items: [
    { label: "Skill Gap Analytics", href: "/institution/placement/skill-gaps", icon: TrendingUp },
  ] },
  { label: "Industry Relations", items: [
    { label: "Industry Relations", href: "/institution/placement/industry-relations", icon: Building2 },
  ] },
  { label: "Resources & Analytics", items: [
    { label: "Resource Intelligence", href: "/institution/placement/resources", icon: FolderKanban },
    { label: "Analytics", href: "/institution/placement/analytics", icon: LineChart },
  ] },
  { label: "", items: [
    { label: "Notifications", href: "/institution/placement/notifications", icon: Bell },
  ] },
];

export const recruiterNav: NavGroup[] = [
  { label: "Workspace", items: [
    { label: "Dashboard", href: "/industry/recruiter", icon: LayoutDashboard },
  ] },
  { label: "Talent", items: [
    { label: "Talent Discovery", href: "/industry/recruiter/talent", icon: UserSearch },
  ] },
  { label: "Jobs", items: [
    { label: "Jobs", href: "/industry/recruiter/jobs", icon: Briefcase },
    { label: "Post a Job", href: "/industry/recruiter/jobs/new", icon: PlusCircle },
  ] },
  { label: "Pipeline", items: [
    { label: "Pipeline", href: "/industry/recruiter/pipeline", icon: KanbanSquare },
    { label: "Interviews", href: "/industry/recruiter/interviews", icon: CalendarCheck2 },
  ] },
];

export const companyNav: NavGroup[] = [
  { label: "Workspace", items: [
    { label: "Collaboration Hub", href: "/industry/company", icon: LayoutDashboard },
  ] },
  { label: "Talent & Colleges", items: [
    { label: "College Discovery", href: "/industry/company/colleges", icon: School },
    { label: "Faculty Network", href: "/industry/company/faculty", icon: Users2 },
  ] },
  { label: "Opportunities", items: [
    { label: "Opportunities", href: "/industry/company/opportunities", icon: FileStack },
    { label: "Post Opportunity", href: "/industry/company/opportunities/new", icon: PlusCircle },
    { label: "Startup Assistant", href: "/industry/company/startup-assistant", icon: Rocket },
  ] },
  { label: "Collaborations", items: [
    { label: "Collaborations", href: "/industry/company/collaborations", icon: GitBranch },
  ] },
  { label: "", items: [
    { label: "Analytics", href: "/industry/company/analytics", icon: LineChart },
  ] },
];

export type PortalKey = "student" | "faculty" | "placement" | "recruiter" | "company";

export const portalMeta: Record<PortalKey, { title: string; nav: NavGroup[]; org: string; switchHref: string }> = {
  student: { title: "Student Portal", nav: studentNav, org: "Rajalakshmi Engineering College", switchHref: "/institution" },
  faculty: { title: "Faculty Portal", nav: facultyNav, org: "Vishwakarma Institute of Technology", switchHref: "/institution" },
  placement: { title: "Placement Cell", nav: placementNav, org: "Vishwakarma Institute of Technology", switchHref: "/institution" },
  recruiter: { title: "Recruiter Portal", nav: recruiterNav, org: "Talent Acquisition", switchHref: "/industry" },
  company: { title: "Industry Portal", nav: companyNav, org: "Industry Collaboration", switchHref: "/industry" },
};
