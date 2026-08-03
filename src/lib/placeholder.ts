export function seedHash(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function seededRandom(seed: string): () => number {
  let value = seedHash(seed) || 1;
  return () => {
    value = (value * 1103515245 + 12345) & 0x7fffffff;
    return value / 0x7fffffff;
  };
}

export function pick<T>(seed: string, arr: T[]): T {
  const rand = seededRandom(seed);
  return arr[Math.floor(rand() * arr.length) % arr.length];
}
