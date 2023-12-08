import { describe, expect, it } from "bun:test";
import { partA, partB } from "./solve";

describe("part A", () => {
  it("should pass", () => {
    expect(partA(["Time:      7  15   30", "Distance:  9  40  200"])).toEqual(
      288
    );
  });
});

describe("part B", () => {
  it("should pass", () => {
    expect(partB(["Time:      7  15   30", "Distance:  9  40  200"])).toEqual(
      71503
    );
  });
});
