import { describe, expect, it } from "bun:test";
import { partA, partB } from "./solve";

const exampleInputA = `
xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
`;
const exampleInputB = `
xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))
`;
const expectedOutputA = 161;
const expectedOutputB = 48;

describe("part A", () => {
  it("should pass", async () => {
    expect(await partA(exampleInputA.trim().split("\n"))).toEqual(
      expectedOutputA
    );
  });
});

describe("part B", () => {
  it("should pass", async () => {
    expect(await partB(exampleInputB.trim().split("\n"))).toEqual(
      expectedOutputB
    );
  });
});
