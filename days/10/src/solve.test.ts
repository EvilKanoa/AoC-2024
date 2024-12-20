import { describe, expect, it } from "bun:test";
import { partA, partB } from "./solve";

const exampleInput = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`;
const expectedOutputA = 36;
const expectedOutputB = 81;

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
