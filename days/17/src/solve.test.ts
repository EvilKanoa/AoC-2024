import { describe, expect, it } from "bun:test";
import { partA, partB } from "./solve";

const exampleInput = `
2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533
`;
const expectedOutputA = 102;
const expectedOutputB = 94;

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
