export const pairs = <T>(arr: T[]): [T, T][] =>
  arr.map((v, i) => arr.slice(i + 1).map((w) => [v, w] as [T, T])).flat();
