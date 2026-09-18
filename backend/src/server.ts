import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import { students, studentById, readinessLabel, currentStudent } from "./data/students";
import { colleges, collegeById } from "./data/colleges";
import { companies, companyById } from "./data/companies";
import { faculty, facultyById, currentFaculty } from "./data/faculty";
import { alumni, alumniById } from "./data/alumni";
import { jobs, jobById, fullTimeAndInternJobs } from "./data/jobs";
import { projects, projectsByStudent } from "./data/projects";
import {
  assessmentDefs,
  assessmentById,
  assessmentResults,
  resultsByStudent,
  questionsFor,
  categories,
  difficulties,
} from "./data/assessments";
import { applications, applicationsByStudent, applicationsByJob, pipelineStages } from "./data/applications";
import { notificationsSeed, notificationsFor } from "./data/notifications";
import { skills, skillById, skillName } from "./data/skills";
import { runMigrations } from "./db";
import { authRouter } from "./auth/routes";

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Comma-separated list of allowed origins, e.g. "https://skilldex.vercel.app,http://localhost:3000"
const allowedOrigins = (process.env.FRONTEND_ORIGIN ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow no-origin requests (curl, server-to-server, health checks)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
  })
);
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// --- health check (Railway uses this) ---
app.get("/health", (_req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));
app.get("/", (_req, res) => res.json({ name: "SkillDex API", status: "ok" }));

// --- auth: real database-backed registration/login (see src/auth/) ---
app.use("/api/auth", authRouter);

// --- one-shot bootstrap payload: everything the frontend needs, in a single round trip ---
app.get("/api/bootstrap", (_req, res) => {
  res.json({
    students,
    currentStudentId: currentStudent.id,
    colleges,
    companies,
    faculty,
    currentFacultyId: currentFaculty.id,
    alumni,
    jobs,
    fullTimeAndInternJobIds: fullTimeAndInternJobs.map((j) => j.id),
    projects,
    assessmentDefs,
    assessmentResults,
    categories,
    difficulties,
    applications,
    pipelineStages,
    notifications: notificationsSeed,
    skills,
  });
});

// --- students ---
app.get("/api/students", (_req, res) => res.json(students));
app.get("/api/students/:id", (req, res) => {
  const s = studentById(req.params.id);
  if (!s) return res.status(404).json({ error: "Student not found" });
  res.json({ ...s, readinessLabel: readinessLabel(s.readiness) });
});
app.get("/api/students/:id/projects", (req, res) => res.json(projectsByStudent(req.params.id)));
app.get("/api/students/:id/assessment-results", (req, res) => res.json(resultsByStudent(req.params.id)));
app.get("/api/students/:id/applications", (req, res) => res.json(applicationsByStudent(req.params.id)));

// --- colleges ---
app.get("/api/colleges", (_req, res) => res.json(colleges));
app.get("/api/colleges/:id", (req, res) => {
  const c = collegeById(req.params.id);
  if (!c) return res.status(404).json({ error: "College not found" });
  res.json(c);
});

// --- companies ---
app.get("/api/companies", (_req, res) => res.json(companies));
app.get("/api/companies/:id", (req, res) => {
  const c = companyById(req.params.id);
  if (!c) return res.status(404).json({ error: "Company not found" });
  res.json(c);
});

// --- faculty ---
app.get("/api/faculty", (_req, res) => res.json(faculty));
app.get("/api/faculty/:id", (req, res) => {
  const f = facultyById(req.params.id);
  if (!f) return res.status(404).json({ error: "Faculty not found" });
  res.json(f);
});

// --- alumni ---
app.get("/api/alumni", (_req, res) => res.json(alumni));
app.get("/api/alumni/:id", (req, res) => {
  const a = alumniById(req.params.id);
  if (!a) return res.status(404).json({ error: "Alumni not found" });
  res.json(a);
});

// --- jobs ---
app.get("/api/jobs", (_req, res) => res.json(jobs));
app.get("/api/jobs/:id", (req, res) => {
  const j = jobById(req.params.id);
  if (!j) return res.status(404).json({ error: "Job not found" });
  res.json(j);
});
app.get("/api/jobs/:id/applications", (req, res) => res.json(applicationsByJob(req.params.id)));

// --- assessments ---
app.get("/api/assessments", (_req, res) => res.json(assessmentDefs));
app.get("/api/assessments/:id", (req, res) => {
  const a = assessmentById(req.params.id);
  if (!a) return res.status(404).json({ error: "Assessment not found" });
  res.json(a);
});
app.get("/api/assessments/:id/questions", (req, res) => {
  const a = assessmentById(req.params.id);
  if (!a) return res.status(404).json({ error: "Assessment not found" });
  res.json(questionsFor(a.skillId));
});

// --- applications ---
app.get("/api/applications", (_req, res) => res.json(applications));

// --- skills ---
app.get("/api/skills", (_req, res) => res.json(skills));
app.get("/api/skills/:id", (req, res) => {
  const s = skillById(req.params.id);
  if (!s) return res.status(404).json({ error: "Skill not found" });
  res.json({ ...s, name: skillName(s.id) });
});

// --- notifications ---
app.get("/api/notifications", (req, res) => {
  const audience = req.query.audience as string | undefined;
  res.json(audience ? notificationsFor(audience as never) : notificationsSeed);
});

// 404 fallback
app.use((req, res) => res.status(404).json({ error: `No route for ${req.method} ${req.path}` }));

// error handler (e.g. CORS rejection)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: err.message });
});

runMigrations()
  .catch((err) => console.error("Migration failed:", err))
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`SkillDex API listening on port ${PORT}`);
      console.log(`Allowed origins: ${allowedOrigins.join(", ")}`);
    });
  });
