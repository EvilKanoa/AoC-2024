export const split = <T>(data: T[], predicate: (val: T) => boolean): T[][] => {
  const arrays = [];
  let group = [];

  for (const item of data) {
    if (predicate(item)) {
      if (group.length > 0) {
        arrays.push(group);
        group = [];
      }
    } else {
      group.push(item);
    }
  }

  if (group.length > 0) {
    arrays.push(group);
  }

  return arrays;
};
