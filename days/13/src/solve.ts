import { GridCell, Solver, SparseGrid, split, sum } from "shared";

// \--- Day 13: Point of Incidence ---
// -----------------------------------
//
// With your help, the hot springs team locates an appropriate spring which launches you neatly and precisely up to the edge of _Lava Island_.
//
// There's just one problem: you don't see any _lava_.
//
// You _do_ see a lot of ash and igneous rock; there are even what look like gray mountains scattered around. After a while, you make your way to a nearby cluster of mountains only to discover that the valley between them is completely full of large _mirrors_. Most of the mirrors seem to be aligned in a consistent way; perhaps you should head in that direction?
//
// As you move through the valley of mirrors, you find that several of them have fallen from the large metal frames keeping them in place. The mirrors are extremely flat and shiny, and many of the fallen mirrors have lodged into the ash at strange angles. Because the terrain is all one color, it's hard to tell where it's safe to walk or where you're about to run into a mirror.
//
// You note down the patterns of ash (`.`) and rocks (`#`) that you see as you walk (your puzzle input); perhaps by carefully analyzing these patterns, you can figure out where the mirrors are!
//
// For example:
//
//     #.##..##.
//     ..#.##.#.
//     ##......#
//     ##......#
//     ..#.##.#.
//     ..##..##.
//     #.#.##.#.
//
//     #...##..#
//     #....#..#
//     ..##..###
//     #####.##.
//     #####.##.
//     ..##..###
//     #....#..#
//
//
// To find the reflection in each pattern, you need to find a perfect reflection across either a horizontal line between two rows or across a vertical line between two columns.
//
// In the first pattern, the reflection is across a vertical line between two columns; arrows on each of the two columns point at the line between the columns:
//
//     123456789
//         ><
//     #.##..##.
//     ..#.##.#.
//     ##......#
//     ##......#
//     ..#.##.#.
//     ..##..##.
//     #.#.##.#.
//         ><
//     123456789
//
//
// In this pattern, the line of reflection is the vertical line between columns 5 and 6. Because the vertical line is not perfectly in the middle of the pattern, part of the pattern (column 1) has nowhere to reflect onto and can be ignored; every other column has a reflected column within the pattern and must match exactly: column 2 matches column 9, column 3 matches 8, 4 matches 7, and 5 matches 6.
//
// The second pattern reflects across a horizontal line instead:
//
//     1 #...##..# 1
//     2 #....#..# 2
//     3 ..##..### 3
//     4v#####.##.v4
//     5^#####.##.^5
//     6 ..##..### 6
//     7 #....#..# 7
//
//
// This pattern reflects across the horizontal line between rows 4 and 5. Row 1 would reflect with a hypothetical row 8, but since that's not in the pattern, row 1 doesn't need to match anything. The remaining rows match: row 2 matches row 7, row 3 matches row 6, and row 4 matches row 5.
//
// To _summarize_ your pattern notes, add up _the number of columns_ to the left of each vertical line of reflection; to that, also add _100 multiplied by the number of rows_ above each horizontal line of reflection. In the above example, the first pattern's vertical line has `5` columns to its left and the second pattern's horizontal line has `4` rows above it, a total of `_405_`.
//
// Find the line of reflection in each of the patterns in your notes. _What number do you get after summarizing all of your notes?_

enum Tile {
  ASH = ".",
  ROCK = "#",
  NONE = "",
}

const isTile = (val: string): val is Tile =>
  val === Tile.ASH || val === Tile.ROCK || val === Tile.NONE;

const parsePattern = (lines: string[]) => {
  const pattern = new SparseGrid<Tile>(Tile.NONE);

  lines.forEach((line, y) =>
    [...line].filter(isTile).forEach((tile, x) => {
      pattern.set(x, y, tile);
    })
  );

  return pattern;
};

const tileListsEqual = (a: GridCell<Tile>[], b: GridCell<Tile>[]) =>
  a.length === b.length &&
  a.every(
    ({ value }, idx) =>
      value === Tile.NONE ||
      b[idx].value === Tile.NONE ||
      b[idx].value === value
  );

const reflectionsEqual = (
  a: { x: number } | { y: number },
  b: { x: number } | { y: number }
) => {
  if ("x" in a && "x" in b) {
    return a.x === b.x;
  } else if ("y" in a && "y" in b) {
    return a.y === b.y;
  }

  return false;
};

const findReflection = (
  pattern: SparseGrid<Tile>,
  ignore?: { x: number } | { y: number }
): { x: number } | { y: number } => {
  const extents = pattern.extents(0);

  // check for a vertical reflection
  for (let x = extents[0][0]; x < extents[0][1]; x++) {
    if (ignore != null && "x" in ignore && x + 1 === ignore.x) {
      continue;
    }

    // check if this is the reflection point
    let step = 0;
    while (
      tileListsEqual(
        pattern.columnCells(x - step),
        pattern.columnCells(x + step + 1)
      )
    ) {
      if (x - step <= extents[0][0] || x + step + 1 >= extents[0][1]) {
        return { x: x + 1 };
      }
      step++;
    }
  }

  // check for horizontal reflection
  for (let y = extents[1][0]; y < extents[1][1]; y++) {
    if (ignore != null && "y" in ignore && y + 1 === ignore.y) {
      continue;
    }

    // check if this is the reflection point
    let step = 0;
    while (
      tileListsEqual(pattern.rowCells(y - step), pattern.rowCells(y + step + 1))
    ) {
      if (y - step <= extents[1][0] || y + step + 1 >= extents[1][1]) {
        return { y: y + 1 };
      }
      step++;
    }
  }

  throw new Error("No reflection found:");
};

export const partA: Solver = (lines: string[]) =>
  split(lines, (l) => l.length === 0)
    .map(parsePattern)
    .map((r) => findReflection(r))
    .map((r) => ("x" in r ? r.x : r.y * 100))
    .reduce(sum);

export const partB: Solver = (lines: string[]) =>
  split(lines, (l) => l.length === 0)
    .map(parsePattern)
    .map((p) => {
      const original = findReflection(p);
      for (const cell of p.allCells()) {
        try {
          const newReflection = findReflection(
            p
              .clone()
              .set(
                cell.x,
                cell.y,
                cell.value === Tile.ASH ? Tile.ROCK : Tile.ASH
              ),
            original
          );

          if (!reflectionsEqual(original, newReflection)) {
            return newReflection;
          }
        } catch {}
      }
      throw new Error("no smudge here???!");
    })
    .map((r) => ("x" in r ? r.x : r.y * 100))
    .reduce(sum);
