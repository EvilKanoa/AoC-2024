export const findIndexFrom = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
  from: number
) => {
  for (let i = Math.max(0, from); i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }
  return -1;
};

export const findLastIndexFrom = <T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean,
  from: number
) => {
  for (let i = Math.min(array.length - 1, from); i >= 0; i--) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }
  return -1;
};
