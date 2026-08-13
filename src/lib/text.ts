export const clamp = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
