// Hydrates the local seed arrays with data fetched from the SkillDex API
// (deployed separately on Railway — see NEXT_PUBLIC_API_URL). The arrays in
// students.ts/companies.ts/etc. are generated locally at module load so the
// app always has valid data to render immediately and works with zero
// configuration; when NEXT_PUBLIC_API_URL is set, this swaps their contents
// in place for the backend's copy. Both sides run the exact same seeded
// generator (see ./seed.ts), so the content is identical either way — this
// is a real network dependency, not a visual change.
import { students } from "./students";
import { colleges } from "./colleges";
import { companies } from "./companies";
import { faculty } from "./faculty";
import { alumni } from "./alumni";
import { jobs } from "./jobs";
import { projects } from "./projects";
import { assessmentDefs, assessmentResults } from "./assessments";
import { applications } from "./applications";
import { notificationsSeed } from "./notifications";
import { skills } from "./skills";

type HydrationResult = "hydrated" | "skipped" | "error";

let hydrated = false;
let hydrating: Promise<HydrationResult> | null = null;

function replaceInPlace<T>(target: T[], next: unknown): void {
  if (!Array.isArray(next)) return;
  target.length = 0;
  target.push(...(next as T[]));
}

export function isHydrated(): boolean {
  return hydrated;
}

/** Fetches /api/bootstrap from the backend and swaps it into the local arrays. Safe to call repeatedly — only fetches once. */
export function hydrateFromApi(): Promise<HydrationResult> {
  if (hydrated) return Promise.resolve("hydrated");
  if (hydrating) return hydrating;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return Promise.resolve("skipped");

  hydrating = (async (): Promise<HydrationResult> => {
    try {
      const res = await fetch(`${apiUrl.replace(/\/$/, "")}/api/bootstrap`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Bootstrap request failed: ${res.status} ${res.statusText}`);
      const data = await res.json();

      replaceInPlace(students, data.students);
      replaceInPlace(colleges, data.colleges);
      replaceInPlace(companies, data.companies);
      replaceInPlace(faculty, data.faculty);
      replaceInPlace(alumni, data.alumni);
      replaceInPlace(jobs, data.jobs);
      replaceInPlace(projects, data.projects);
      replaceInPlace(assessmentDefs, data.assessmentDefs);
      replaceInPlace(assessmentResults, data.assessmentResults);
      replaceInPlace(applications, data.applications);
      replaceInPlace(notificationsSeed, data.notifications);
      replaceInPlace(skills, data.skills);

      hydrated = true;
      console.info("[SkillDex] Loaded live data from backend:", apiUrl);
      return "hydrated";
    } catch (err) {
      console.warn("[SkillDex] Backend unreachable, using local seed data instead.", err);
      return "error";
    }
  })();

  return hydrating;
}
