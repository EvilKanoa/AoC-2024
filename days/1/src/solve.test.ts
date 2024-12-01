import { describe, expect, it } from "bun:test";
import { partA, partB } from "./solve";

const exampleInput = `
3   4
4   3
2   5
1   3
3   9
3   3
`;
const expectedOutputA = 11;
const expectedOutputB = 31;

describe("part A", () => {
  it("should pass", async () => {
    expect(await partA(exampleInput.trim().split("\n"))).toEqual(
      expectedOutputA
    );
  });
});

describe("part B", () => {
  it("should pass", async () => {
    expect(await partB(exampleInput.trim().split("\n"))).toEqual(
      expectedOutputB
    );
  });
});
