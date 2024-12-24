export const groupBy = <T extends object>(
  data: Array<T>,
  field: keyof T
): Record<string, Array<T>> =>
  data.reduce((acc, item) => {
    const key = item[field] as string;
    acc[key] = [...(acc[key] ?? []), item];
    return acc;
  }, {} as Record<string, Array<T>>);

export const groupByFunction = <
  T extends object,
  K extends string | number | symbol
>(
  data: Array<T>,
  func: (item: T, index: number, data: Array<T>) => K
): Record<K, Array<T>> =>
  data.reduce((acc, item, idx, arr) => {
    const key = func(item, idx, arr);
    acc[key] = [...(acc[key] ?? []), item];
    return acc;
  }, {} as Record<K, Array<T>>);
