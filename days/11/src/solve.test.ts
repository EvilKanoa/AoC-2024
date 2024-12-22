import { describe, expect, it } from "bun:test";
import { partA, partB } from "./solve";

const exampleInput = `
125 17
`;
const expectedOutputA = 55312;
const expectedOutputB = 65601038650482;

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
