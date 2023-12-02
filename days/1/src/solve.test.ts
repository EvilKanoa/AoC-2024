import { describe, expect, it } from "bun:test";
import { partA, partB } from "./solve";

describe("part A", () => {
  it("should pass", () => {
    expect(
      partA(["1abc2", "pqr3stu8vwx", "a1b2c3d4e5f", "treb7uchet"])
    ).toEqual(142);
  });
});

describe("part B", () => {
  it("should pass", () => {
    expect(
      partB([
        "two1nine",
        "eightwothree",
        "abcone2threexyz",
        "xtwone3four",
        "4nineeightseven2",
        "zoneight234",
        "7pqrstsixteen",
      ])
    ).toEqual(281);
  });
});
