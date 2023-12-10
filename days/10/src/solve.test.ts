import { describe, expect, it } from "bun:test";
import { partA, partB } from "./solve";

const exampleInput = `
7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ
`;
const expectedOutputA = 8;
const expectedOutputB = 10;

describe("part A", () => {
  it("should pass", () => {
    expect(partA(exampleInput.trim().split("\n"))).toEqual(expectedOutputA);
  });

  it("should pass", () => {
    expect(
      partA(
        `
-L|F7
7S-7|
L|7||
-L-J|
L|-JF`
          .trim()
          .split("\n")
      )
    ).toEqual(4);
  });
});

describe("part B", () => {
  it("should pass", () => {
    expect(
      partB(
        `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L`
          .trim()
          .split("\n")
      )
    ).toEqual(expectedOutputB);
  });
});
