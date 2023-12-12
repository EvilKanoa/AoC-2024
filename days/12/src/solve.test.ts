import { describe, expect, it } from "bun:test";
import { partA, partB } from "./solve";

const exampleInput = `
???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1
`;
const expectedOutputA = 21;
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
