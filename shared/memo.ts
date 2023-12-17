export const memo = <Arguments extends unknown[], Result>(
  func: (...args: Arguments) => Result
): ((...args: Arguments) => Result) => {
  const cache = new Map<string, Result>();

  return (...args) => {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache.get(key)!;
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  };
};
