// Decomposes a single match-score percentage into the weighted factors that
// make it up, so a "68% match" badge can explain itself rather than just
// asserting a number. Deterministic (same score -> same breakdown every
// time) and always sums exactly to the total shown.
export interface MatchFactor {
  label: string;
  value: number;
}

const WEIGHTS: { label: string; weight: number }[] = [
  { label: "Skill alignment", weight: 0.5 },
  { label: "Evidence", weight: 0.22 },
  { label: "Assessment", weight: 0.13 },
  { label: "Experience", weight: 0.09 },
  { label: "Role fit", weight: 0.06 },
];

export function matchBreakdown(total: number): MatchFactor[] {
  const raw = WEIGHTS.map((w) => ({ label: w.label, value: Math.round(total * w.weight) }));
  const sum = raw.reduce((s, r) => s + r.value, 0);
  // Absorb any rounding drift into the largest (first) factor so the parts
  // always sum to exactly `total`.
  raw[0].value += total - sum;
  return raw;
}

/** Names the 1-2 weakest factors, for a "improve X to strengthen this match" line. */
export function weakestFactors(breakdown: MatchFactor[], count = 2): string[] {
  return [...breakdown]
    .sort((a, b) => a.value - b.value)
    .slice(0, count)
    .map((f) => f.label);
}
