import { describe, expect, it } from "bun:test";
import { partA, partB } from "./solve";

const exampleInput = `
...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........
`;
const expectedOutputA = 16;
const expectedOutputB = 1594;

describe("part A", () => {
  it("should pass", async () => {
    expect(await partA(exampleInput.trim().split("\n"), 6)).toEqual(
      expectedOutputA
    );
  });
});

describe("part B", () => {
  it("should pass", async () => {
    expect(await partB(exampleInput.trim().split("\n"), 50)).toEqual(
      expectedOutputB
    );
  });
});
