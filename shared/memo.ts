export const MEMO_KEY_CACHE = Symbol.for("memoCacheKeySymbol");
export const MEMO_KEY_UPDATE = Symbol.for("memoUpdateKeySymbol");
export const MEMO_KEY_STATS = Symbol.for("memoStatsKeySymbol");

type MemoFunc<Arguments extends unknown[], Result> = (
  ...args: Arguments
) => Result;

type UpdateFunc<Result> = (source: Map<string, Result>) => void;

interface MemoizedExtra<Result> {
  [MEMO_KEY_CACHE]: Map<string, Result>;
  [MEMO_KEY_UPDATE]: UpdateFunc<Result>;
  [MEMO_KEY_STATS]: { hits: number; misses: number };
}

export type Memoized<Arguments extends unknown[], Result> = MemoFunc<
  Arguments,
  Result
> &
  MemoizedExtra<Result>;

/**
 * Returns a memoized version of the given function. Memoization
 * occurs through `JSON.stringify` on the arguments. All arguments
 * must be JSON serializable. The memoized version will have the
 * properties listed in `MemoizedExtra` available to either access
 * the result cache or update the result cache.
 *
 * Optionally, you can enable stats for the memoized function that
 * will record total hits and misses to the function. By default,
 * this is disabled for performance. You cannot modify this setting
 * after creating the memoized function.
 * @param func The function to memoize
 * @param captureStats Flag to enable stats capture
 * @returns The memoized version of func
 */
export const memoize = <Arguments extends unknown[], Result>(
  func: MemoFunc<Arguments, Result>,
  captureStats = false
): Memoized<Arguments, Result> => {
  const cache = new Map<string, Result>();
  const stats = { hits: 0, misses: 0 };

  const memoized = (
    captureStats
      ? (...args: Arguments) => {
          const key = JSON.stringify(args);
          if (key in cache) {
            stats.hits++;
            return cache.get(key)!;
          }
          const result = func(...args);
          cache.set(key, result);
          stats.misses++;
          return result;
        }
      : (...args: Arguments) => {
          const key = JSON.stringify(args);
          if (key in cache) {
            return cache.get(key)!;
          }
          const result = func(...args);
          cache.set(key, result);
          return result;
        }
  ) as Memoized<Arguments, Result>;

  memoized[MEMO_KEY_STATS] = stats;
  memoized[MEMO_KEY_CACHE] = cache;
  memoized[MEMO_KEY_UPDATE] = ((source) => {
    for (const [key, result] of source) {
      cache.set(key, result);
    }
  }) as UpdateFunc<Result>;

  return memoized;
};

export class SharedCache<Result> {
  shared: Map<string, Result>;

  constructor() {
    this.shared = new Map();
  }

  updateFrom = (source: Map<string, Result>) => {
    for (const [key, result] of source) {
      this.shared.set(key, result);
    }
  };
}
