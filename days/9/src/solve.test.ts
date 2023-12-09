import { describe, expect, it } from "bun:test";
import { partA, partB } from "./solve";

const exampleInput = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`;
const expectedOutputA = 114;
const expectedOutputB = 2;

describe("part A", () => {
  it("should pass", () => {
    expect(partA(exampleInput.trim().split("\n"))).toEqual(expectedOutputA);
  });
});

describe("part B", () => {
  it("should pass", () => {
    expect(partB(exampleInput.trim().split("\n"))).toEqual(expectedOutputB);
  });
});
