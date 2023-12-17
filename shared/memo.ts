export const MEMO_KEY_CACHE = Symbol.for("memoCacheKeySymbol");
export const MEMO_KEY_UPDATE = Symbol.for("memoUpdateKeySymbol");

type MemoFunc<Arguments extends unknown[], Result> = (
  ...args: Arguments
) => Result;

type UpdateFunc<Result> = (source: Map<string, Result>) => void;

interface MemoizedExtra<Result> {
  [MEMO_KEY_CACHE]: Map<string, Result>;
  [MEMO_KEY_UPDATE]: UpdateFunc<Result>;
}

export type Memoized<Arguments extends unknown[], Result> = MemoFunc<
  Arguments,
  Result
> &
  MemoizedExtra<Result>;

export const memoize = <Arguments extends unknown[], Result>(
  func: MemoFunc<Arguments, Result>
): Memoized<Arguments, Result> => {
  const cache = new Map<string, Result>();

  const memoized = (...args: Arguments) => {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache.get(key)!;
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  };

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
