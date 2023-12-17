import { sleep } from "bun";
import { EMPTY_10, EMPTY_32, EMPTY_5, Solver, sum } from "shared";

// \--- Day 12: Hot Springs ---
// ----------------------------
//
// You finally reach the hot springs! You can see steam rising from secluded areas attached to the primary, ornate building.
//
// As you turn to enter, the [researcher](11) stops you. "Wait - I thought you were looking for the hot springs, weren't you?" You indicate that this definitely looks like hot springs to you.
//
// "Oh, sorry, common mistake! This is actually the [onsen](https://en.wikipedia.org/wiki/Onsen)! The hot springs are next door."
//
// You look in the direction the researcher is pointing and suddenly notice the massive metal helixes towering overhead. "This way!"
//
// It only takes you a few more steps to reach the main gate of the massive fenced-off area containing the springs. You go through the gate and into a small administrative building.
//
// "Hello! What brings you to the hot springs today? Sorry they're not very hot right now; we're having a _lava shortage_ at the moment." You ask about the missing machine parts for Desert Island.
//
// "Oh, all of Gear Island is currently offline! Nothing is being manufactured at the moment, not until we get more lava to heat our forges. And our springs. The springs aren't very springy unless they're hot!"
//
// "Say, could you go up and see why the lava stopped flowing? The springs are too cold for normal operation, but we should be able to find one springy enough to launch _you_ up there!"
//
// There's just one problem - many of the springs have fallen into disrepair, so they're not actually sure which springs would even be _safe_ to use! Worse yet, their _condition records of which springs are damaged_ (your puzzle input) are also damaged! You'll need to help them repair the damaged records.
//
// In the giant field just outside, the springs are arranged into _rows_. For each row, the condition records show every spring and whether it is _operational_ (`.`) or _damaged_ (`#`). This is the part of the condition records that is itself damaged; for some springs, it is simply _unknown_ (`?`) whether the spring is operational or damaged.
//
// However, the engineer that produced the condition records also duplicated some of this information in a different format! After the list of springs for a given row, the size of each _contiguous group of damaged springs_ is listed in the order those groups appear in the row. This list always accounts for every damaged spring, and each number is the entire size of its contiguous group (that is, groups are always separated by at least one operational spring: `####` would always be `4`, never `2,2`).
//
// So, condition records with no unknown spring conditions might look like this:
//
//     #.#.### 1,1,3
//     .#...#....###. 1,1,3
//     .#.###.#.###### 1,3,1,6
//     ####.#...#... 4,1,1
//     #....######..#####. 1,6,5
//     .###.##....# 3,2,1
//
//
// However, the condition records are partially damaged; some of the springs' conditions are actually _unknown_ (`?`). For example:
//
//     ???.### 1,1,3
//     .??..??...?##. 1,1,3
//     ?#?#?#?#?#?#?#? 1,3,1,6
//     ????.#...#... 4,1,1
//     ????.######..#####. 1,6,5
//     ?###???????? 3,2,1
//
//
// Equipped with this information, it is your job to figure out _how many different arrangements_ of operational and broken springs fit the given criteria in each row.
//
// In the first line (`???.### 1,1,3`), there is exactly _one_ way separate groups of one, one, and three broken springs (in that order) can appear in that row: the first three unknown springs must be broken, then operational, then broken (`#.#`), making the whole row `#.#.###`.
//
// The second line is more interesting: `.??..??...?##. 1,1,3` could be a total of _four_ different arrangements. The last `?` must always be broken (to satisfy the final contiguous group of three broken springs), and each `??` must hide exactly one of the two broken springs. (Neither `??` could be both broken springs or they would form a single contiguous group of two; if that were true, the numbers afterward would have been `2,3` instead.) Since each `??` can either be `#.` or `.#`, there are four possible arrangements of springs.
//
// The last line is actually consistent with _ten_ different arrangements! Because the first number is `3`, the first and second `?` must both be `.` (if either were `#`, the first number would have to be `4` or higher). However, the remaining run of unknown spring conditions have many different ways they could hold groups of two and one broken springs:
//
//     ?###???????? 3,2,1
//     .###.##.#...
//     .###.##..#..
//     .###.##...#.
//     .###.##....#
//     .###..##.#..
//     .###..##..#.
//     .###..##...#
//     .###...##.#.
//     .###...##..#
//     .###....##.#
//
//
// In this example, the number of possible arrangements for each row is:
//
// *   `???.### 1,1,3` - `_1_` arrangement
// *   `.??..??...?##. 1,1,3` - `_4_` arrangements
// *   `?#?#?#?#?#?#?#? 1,3,1,6` - `_1_` arrangement
// *   `????.#...#... 4,1,1` - `_1_` arrangement
// *   `????.######..#####. 1,6,5` - `_4_` arrangements
// *   `?###???????? 3,2,1` - `_10_` arrangements
//
// Adding all of the possible arrangement counts together produces a total of `_21_` arrangements.
//
// For each row, count all of the different arrangements of operational and broken springs that meet the given criteria. _What is the sum of those counts?_

export enum Condition {
  OPERATIONAL = ".",
  DAMAGED = "#",
  UNKNOWN = "?",
}

export interface SpringRow {
  conditions: Condition[];
  groups: number[];
}

const isCondition = (c: string): c is Condition =>
  c === Condition.OPERATIONAL ||
  c === Condition.DAMAGED ||
  c === Condition.UNKNOWN;

const parseRow = (line: string): SpringRow => {
  const [conditionStr, groupStr] = line.split(" ");
  return {
    conditions: [...conditionStr].filter(isCondition),
    groups: groupStr
      .split(",")
      .filter((g) => g.length)
      .map((v) => parseInt(v, 10)),
  };
};

const rowToString = (row: SpringRow) =>
  `${row.conditions.join("")} ${row.groups.join(",")}`;

const getArrangementValidity = (arrangement: Condition[], groups: number[]) => {
  const remainingGroups = [...groups];
  let currentGroup: null | number = null;

  for (const c of arrangement) {
    switch (c) {
      case Condition.UNKNOWN:
        throw new Error("Cannot check arrangement validity with unknowns!");
      case Condition.OPERATIONAL:
        if (currentGroup != null) {
          if (currentGroup !== 0) {
            return false;
          }

          currentGroup = null;
        }
        break;
      case Condition.DAMAGED:
        if (currentGroup == null) {
          if (remainingGroups.length === 0) {
            return false;
          }

          currentGroup = remainingGroups.shift()! - 1;
        } else {
          currentGroup -= 1;
          if (currentGroup < 0) {
            return false;
          }
        }
        break;
    }
  }

  return { remainingGroups, currentGroup };
};

const isArrangementValid = (
  arrangement: Condition[],
  groups: number[]
): boolean => {
  const validity = getArrangementValidity(arrangement, groups);

  return (
    validity &&
    validity.remainingGroups.length === 0 &&
    (validity.currentGroup == null || validity.currentGroup === 0)
  );
};

const computeAllArrangements = (conditions: Condition[]): Condition[][] => {
  const computeFrom = (partialConditions: Condition[]): Condition[][] => {
    if (partialConditions.length === conditions.length) {
      return [partialConditions];
    }

    const nextCondition = conditions[partialConditions.length];
    if (nextCondition !== Condition.UNKNOWN) {
      return computeFrom([...partialConditions, nextCondition]);
    } else {
      return [
        ...computeFrom([...partialConditions, Condition.DAMAGED]),
        ...computeFrom([...partialConditions, Condition.OPERATIONAL]),
      ];
    }
  };

  return computeFrom([]);
};

export const partA: Solver = (lines: string[]) => {
  const rows = lines.map(parseRow);

  // using improvements for part B greatly speeds up part A as well
  return rows.map((row) => countValidArrangements(row)).reduce(sum);
  // return rows
  //   .map((row) =>
  //     computeAllArrangements(row.conditions).filter((arrangement) =>
  //       isArrangementValid(arrangement, row.groups)
  //     )
  //   )
  //   .map((arrangements) => arrangements.length)
  //   .reduce(sum);
};

const unfoldRow = (row: SpringRow): SpringRow => ({
  conditions: EMPTY_5.flatMap((_, idx) => [
    ...(idx !== 0 ? [Condition.UNKNOWN] : []),
    ...row.conditions,
  ]),
  groups: EMPTY_5.flatMap(() => row.groups),
});

export const countValidArrangements = (row: SpringRow): number => {
  const countFrom = (part: Condition[]): number => {
    // base case: part is full row length, either is or isn't valid
    if (part.length === row.conditions.length) {
      return isArrangementValid(part, row.groups) ? 1 : 0;
    }

    // 1:1 case: known entry, move to next
    if (row.conditions[part.length] !== Condition.UNKNOWN) {
      return countFrom([...part, row.conditions[part.length]]);
    }

    // otherwise, check current validity
    const validity = getArrangementValidity(part, row.groups);

    // if current is already invalid, no possible valid arrangements
    if (!validity) {
      return 0;
    }

    const canNextBeDamaged =
      (validity.remainingGroups.length > 0 && validity.currentGroup === null) ||
      (validity.currentGroup ?? 0) > 0;
    const canNextBeOperational = (validity.currentGroup ?? 0) === 0;

    const ifDamagedCount = canNextBeDamaged
      ? countFrom([...part, Condition.DAMAGED])
      : 0;
    const ifOperationalCount = canNextBeOperational
      ? countFrom([...part, Condition.OPERATIONAL])
      : 0;

    return ifDamagedCount + ifOperationalCount;
  };

  const validArrangements = countFrom([]);
  console.log(
    `Found ${validArrangements} valid arrangement(s) for ${rowToString(row)}`
  );
  return validArrangements;
};

export const partB: Solver = async (lines: string[]) => {
  const rows = lines.map(parseRow).map(unfoldRow);
  let result = 0;

  // tracks which workers by ID are currently processing
  const processing = new Set<number>();
  EMPTY_32.forEach((_, id) => {
    const newWorker = new Worker(new URL("worker.ts", import.meta.url).href);

    const postNextRow = () => {
      if (rows.length) {
        processing.add(id);
        newWorker.postMessage(rows.shift()!);
      } else {
        newWorker.terminate();
      }
    };

    newWorker.addEventListener("message", (event: MessageEvent<number>) => {
      result += event.data;
      processing.delete(id);
      postNextRow();
    });

    postNextRow();
  });

  // so uh, let's see if this can brute force it lmao
  while (rows.length > 0 || processing.size > 0) {
    // async sleep eh
    await sleep(100);
  }

  return result;

  // yeah so time complexity absolutely explodes for part B, don't think it can be brute forced on CPU
  // return rows
  //   .map((row) =>
  //     computeAllArrangements(row.conditions).filter((arrangement) =>
  //       isArrangementValid(arrangement, row.groups)
  //     )
  //   )
  //   .map((arrangements) => arrangements.length)
  //   .reduce(sum);

  // this approach was making progress, albeit very, very slow progress
  // return rows.map((row) => countValidArrangements(row)).reduce(sum);
};
