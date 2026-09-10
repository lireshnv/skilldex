import { ApplicationRecord } from "../types";
import { makeRng } from "./seed";
import { students } from "./students";
import { jobs } from "./jobs";

const stages: ApplicationRecord["stage"][] = [
  "Applied", "Screened", "Shortlisted", "Assessment", "Interview", "Final", "Offer", "Hired", "Rejected",
];

function buildApplications(): ApplicationRecord[] {
  const out: ApplicationRecord[] = [];
  let id = 1;
  students.forEach((student, si) => {
    const rng2 = makeRng(4200 + si * 17);
    const count = rng2.int(0, 4);
    const chosenJobs = rng2.pickMany(jobs, count);
    chosenJobs.forEach((job) => {
      out.push({
        id: `app-${String(id++).padStart(4, "0")}`,
        studentId: student.id,
        jobId: job.id,
        stage: rng2.pick(stages),
        appliedOn: `2026-0${rng2.int(1, 8)}-${String(rng2.int(1, 27)).padStart(2, "0")}`,
        matchScore: rng2.int(48, 98),
      });
    });
  });
  return out;
}

export const applications: ApplicationRecord[] = buildApplications();

export function applicationsByStudent(studentId: string) {
  return applications.filter((a) => a.studentId === studentId);
}

export function applicationsByJob(jobId: string) {
  return applications.filter((a) => a.jobId === jobId);
}

export const pipelineStages: ApplicationRecord["stage"][] = [
  "Applied", "Screened", "Shortlisted", "Assessment", "Interview", "Final", "Offer", "Hired",
];
