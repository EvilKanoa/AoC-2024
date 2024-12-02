import type { Solver } from "shared";

// \--- Day 2: Red-Nosed Reports ---
// ---------------------------------
//
// Fortunately, the first location The Historians want to search isn't a long walk from the Chief Historian's office.
//
// While the [Red-Nosed Reindeer nuclear fusion/fission plant](/2015/day/19) appears to contain no sign of the Chief Historian, the engineers there run up to you as soon as they see you. Apparently, they _still_ talk about the time Rudolph was saved through molecular synthesis from a single electron.
//
// They're quick to add that - since you're already here - they'd really appreciate your help analyzing some unusual data from the Red-Nosed reactor. You turn to check if The Historians are waiting for you, but they seem to have already divided into groups that are currently searching every corner of the facility. You offer to help with the unusual data.
//
// The unusual data (your puzzle input) consists of many _reports_, one report per line. Each report is a list of numbers called _levels_ that are separated by spaces. For example:
//
//     7 6 4 2 1
//     1 2 7 8 9
//     9 7 6 2 1
//     1 3 2 4 5
//     8 6 4 4 1
//     1 3 6 7 9
//
//
// This example data contains six reports each containing five levels.
//
// The engineers are trying to figure out which reports are _safe_. The Red-Nosed reactor safety systems can only tolerate levels that are either gradually increasing or gradually decreasing. So, a report only counts as safe if both of the following are true:
//
// *   The levels are either _all increasing_ or _all decreasing_.
// *   Any two adjacent levels differ by _at least one_ and _at most three_.
//
// In the example above, the reports can be found safe or unsafe by checking those rules:
//
// *   `7 6 4 2 1`: _Safe_ because the levels are all decreasing by 1 or 2.
// *   `1 2 7 8 9`: _Unsafe_ because `2 7` is an increase of 5.
// *   `9 7 6 2 1`: _Unsafe_ because `6 2` is a decrease of 4.
// *   `1 3 2 4 5`: _Unsafe_ because `1 3` is increasing but `3 2` is decreasing.
// *   `8 6 4 4 1`: _Unsafe_ because `4 4` is neither an increase or a decrease.
// *   `1 3 6 7 9`: _Safe_ because the levels are all increasing by 1, 2, or 3.
//
// So, in this example, `_2_` reports are _safe_.
//
// Analyze the unusual data from the engineers. _How many reports are safe?_

const parseReport = (line: string) =>
  line.split(/\s+/g).map((num) => Number.parseInt(num));

const isSafe = (report: number[]) => {
  if (report.length < 2) {
    return true;
  }

  const [first, second] = report;
  const shouldIncrease = first < second;

  for (let i = 1; i < report.length; i++) {
    // is no longer safe if delta is less than 1 or more than 3, or if it doesn't match isIncreasing
    const delta = Math.abs(report[i - 1] - report[i]);
    const isIncreasing = report[i - 1] < report[i];

    // must always increase or decrease
    if (shouldIncrease !== isIncreasing) {
      return false;
    }

    if (delta < 1 || delta > 3) {
      return false;
    }
  }

  return true;
};

const dampenReport = (report: number[]) => {
  const reports = [report];
  for (let i = 0; i < report.length; i++) {
    reports.push(report.filter((_, idx) => idx !== i));
  }
  return reports;
};

export const partA: Solver = (lines: string[]) => {
  let safe = 0;

  for (const line of lines) {
    if (isSafe(parseReport(line))) safe++;
  }

  return safe;
};

export const partB: Solver = (lines: string[]) => {
  let safe = 0;

  for (const line of lines) {
    const report = parseReport(line);
    const dampened = dampenReport(report);
    if (dampened.some(isSafe)) safe++;
  }

  return safe;
};
