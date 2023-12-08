import { describe, expect, it } from "bun:test";
import { partA, partB } from "./solve";

describe("part A", () => {
  it("should pass", () => {
    expect(
      partA(["32T3K 765", "T55J5 684", "KK677 28", "KTJJT 220", "QQQJA 483"])
    ).toEqual(6440);
  });
});

describe("part B", () => {
  it("should pass", () => {
    expect(
      partB(["32T3K 765", "T55J5 684", "KK677 28", "KTJJT 220", "QQQJA 483"])
    ).toEqual(5905);
  });
});
