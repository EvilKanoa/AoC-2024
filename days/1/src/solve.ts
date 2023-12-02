import { Solver } from "shared";

export const partA: Solver = (lines: string[]) => 
lines
  .map((line) => {
    const match = line.match(/\d/g);

    if (match == null) {
      throw `Failed to match on ${line}!`;
    }

    const [a, b] = [match[0], match[match.length - 1]];
    const [valueA, valueB] = [parseInt(a), parseInt(b)];
    const value = valueA * 10 + valueB;

    return value;
  })
  .reduce((a, b) => a + b);

const CLEANING = {
  one: "o1e",
  two: "t2o",
  three: "t3e",
  four: "f4r",
  five: "f5e",
  six: "s6x",
  seven: "s7n",
  eight: "e8t",
  nine: "n9e",
};

export const partB: Solver = (lines: string[]) =>
  lines
    .map((line) => {
      const cleaned = Object.entries(CLEANING).reduce(
        (l, [k, v]) => l.replaceAll(k, v),
        line
      );
      const match = cleaned.match(/\d/g);

      if (match == null) {
        throw `Failed to match on ${line}!`;
      }

      const [a, b] = [match[0], match[match.length - 1]];
      const [valueA, valueB] = [parseInt(a), parseInt(b)];
      const value = valueA * 10 + valueB;

      return value;
    })
    .reduce((a, b) => a + b);
