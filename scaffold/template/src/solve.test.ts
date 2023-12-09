import { describe, expect, it } from "bun:test";
import { partA, partB } from "./solve";

const exampleInput = `

`;
const expectedOutputA = 0;
const expectedOutputB = 0;

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
