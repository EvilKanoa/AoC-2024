import { describe, expect, it } from "bun:test";
import { partA, partB } from "./solve";

const exampleInput1 = `
broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a
`;
const exampleInput2 = `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output
`;
const expectedOutputA1 = 32000000;
const expectedOutputA2 = 11687500;
const expectedOutputB = 0;

describe("part A", () => {
  it.only("should pass", async () => {
    expect(
      await partA(
        exampleInput1
          .trim()
          .split("\n")
          .filter((l) => l.length)
      )
    ).toEqual(expectedOutputA1);
  });

  it("should pass", async () => {
    expect(
      await partA(
        exampleInput2
          .trim()
          .split("\n")
          .filter((l) => l.length)
      )
    ).toEqual(expectedOutputA2);
  });
});

describe("part B", () => {
  it("should pass", async () => {
    expect(
      await partB(
        exampleInput2
          .trim()
          .split("\n")
          .filter((l) => l.length)
      )
    ).toEqual(expectedOutputB);
  });
});
