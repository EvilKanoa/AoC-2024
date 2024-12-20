import { describe, expect, it } from "bun:test";
import { partA, partB } from "./solve";

const exampleInput = `
2333133121414131402
`;
const expectedOutputA = 1928;
const expectedOutputB = 2858;

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
