export const groupBy = <T extends object>(
  data: Array<T>,
  field: keyof T
): Record<string, Array<T>> =>
  data.reduce((acc, item) => {
    const key = item[field] as string;
    acc[key] = [...(acc[key] ?? []), item];
    return acc;
  }, {} as Record<string, Array<T>>);
