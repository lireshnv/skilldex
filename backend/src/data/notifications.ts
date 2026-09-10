import { Notification } from "../types";

export const notificationsSeed: Notification[] = [
  { id: "ntf-01", audience: "student", title: "Application moved to Interview", body: "Your TCS Software Engineer application moved to the Interview stage.", time: "2h ago", read: false, kind: "success" },
  { id: "ntf-02", audience: "student", title: "New internship match", body: "Freshworks Frontend Intern matches 88% of your skill profile.", time: "5h ago", read: false, kind: "info" },
  { id: "ntf-03", audience: "student", title: "Readiness increased", body: "Your DSA readiness increased to 74% after your latest assessment.", time: "1d ago", read: true, kind: "success" },
  { id: "ntf-04", audience: "student", title: "Upcoming deadline", body: "Razorpay SDE Internship applications close in 3 days.", time: "1d ago", read: true, kind: "warning" },
  { id: "ntf-05", audience: "student", title: "Mock interview scheduled", body: "Your mock interview with an alumni mentor is scheduled for Friday, 4 PM.", time: "2d ago", read: true, kind: "info" },

  { id: "ntf-06", audience: "faculty", title: "New FDP opportunity", body: "A Cloud Architecture FDP matches your expertise in Cloud Computing.", time: "3h ago", read: false, kind: "info" },
  { id: "ntf-07", audience: "faculty", title: "Consultancy request", body: "Razorpay has requested a consultancy engagement in FinTech systems.", time: "1d ago", read: false, kind: "info" },
  { id: "ntf-08", audience: "faculty", title: "Mentorship request", body: "3 students requested mentorship in Machine Learning this week.", time: "2d ago", read: true, kind: "info" },

  { id: "ntf-09", audience: "placement", title: "25 students match new internship", body: "Zoho's Frontend Intern opening matches 25 eligible students.", time: "1h ago", read: false, kind: "success" },
  { id: "ntf-10", audience: "placement", title: "Skill gap alert", body: "Cloud Computing readiness dropped 4 points across final-year CSE students.", time: "6h ago", read: false, kind: "warning" },
  { id: "ntf-11", audience: "placement", title: "New company inbound", body: "PhonePe has expressed interest in campus hiring for 2026.", time: "1d ago", read: true, kind: "info" },

  { id: "ntf-12", audience: "recruiter", title: "48 verified candidates match", body: "48 verified candidates match your Backend Developer requirement.", time: "2h ago", read: false, kind: "success" },
  { id: "ntf-13", audience: "recruiter", title: "Interview feedback pending", body: "3 interview scorecards are pending submission.", time: "5h ago", read: false, kind: "warning" },
  { id: "ntf-14", audience: "recruiter", title: "New application", body: "Ananya Iyer applied for the Cloud Engineer role.", time: "1d ago", read: true, kind: "info" },

  { id: "ntf-15", audience: "company", title: "New college match", body: "R.V. College of Engineering matches your AI hiring criteria.", time: "4h ago", read: false, kind: "info" },
  { id: "ntf-16", audience: "company", title: "Hackathon proposal accepted", body: "Vellore Institute of Technology accepted your hackathon proposal.", time: "1d ago", read: false, kind: "success" },
  { id: "ntf-17", audience: "company", title: "Collaboration milestone reached", body: "Your live project with PSG College of Technology is 80% complete.", time: "2d ago", read: true, kind: "info" },
];

export function notificationsFor(audience: Notification["audience"]) {
  return notificationsSeed.filter((n) => n.audience === audience);
}
