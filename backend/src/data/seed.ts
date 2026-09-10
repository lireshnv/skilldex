// Deterministic seeded PRNG so server and client render identical mock data (avoids hydration mismatches).
export function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function makeRng(seed = 42) {
  const rand = mulberry32(seed);
  return {
    float: (min = 0, max = 1) => min + rand() * (max - min),
    int: (min: number, max: number) => Math.floor(min + rand() * (max - min + 1)),
    pick<T>(arr: T[]): T {
      return arr[Math.floor(rand() * arr.length)];
    },
    pickMany<T>(arr: T[], n: number): T[] {
      const copy = [...arr];
      const out: T[] = [];
      for (let i = 0; i < n && copy.length; i++) {
        const idx = Math.floor(rand() * copy.length);
        out.push(copy.splice(idx, 1)[0]);
      }
      return out;
    },
    bool: (p = 0.5) => rand() < p,
  };
}
