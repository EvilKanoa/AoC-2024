export const keyBy = <T extends object>(
  data: Array<T>,
  field: keyof T
): Record<string, T> =>
  data.reduce((acc, item) => {
    const key = item[field] as string;
    acc[key] = item;
    return acc;
  }, {} as Record<string, T>);
