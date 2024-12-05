import { SparseGrid, type Solver } from "shared";

// \--- Day 4: Ceres Search ---
// ----------------------------
//
// "Looks like the Chief's not here. Next!" One of The Historians pulls out a device and pushes the only button on it. After a brief flash, you recognize the interior of the [Ceres monitoring station](/2019/day/10)!
//
// As the search for the Chief continues, a small Elf who lives on the station tugs on your shirt; she'd like to know if you could help her with her _word search_ (your puzzle input). She only has to find one word: `XMAS`.
//
// This word search allows words to be horizontal, vertical, diagonal, written backwards, or even overlapping other words. It's a little unusual, though, as you don't merely need to find one instance of `XMAS` - you need to find _all of them_. Here are a few ways `XMAS` might appear, where irrelevant characters have been replaced with `.`:
//
//     ..X...
//     .SAMX.
//     .A..A.
//     XMAS.S
//     .X....
//
//
// The actual word search will be full of letters instead. For example:
//
//     MMMSXXMASM
//     MSAMXMSMSA
//     AMXSXMAAMM
//     MSAMASMSMX
//     XMASAMXAMM
//     XXAMMXXAMA
//     SMSMSASXSS
//     SAXAMASAAA
//     MAMMMXMMMM
//     MXMXAXMASX
//
//
// In this word search, `XMAS` occurs a total of `_18_` times; here's the same word search again, but where letters not involved in any `XMAS` have been replaced with `.`:
//
//     ....XXMAS.
//     .SAMXMS...
//     ...S..A...
//     ..A.A.MS.X
//     XMASAMX.MM
//     X.....XA.A
//     S.S.S.S.SS
//     .A.A.A.A.A
//     ..M.M.M.MM
//     .X.X.XMASX
//
//
// Take a look at the little Elf's word search. _How many times does `XMAS` appear?_

enum SearchChar {
  X = "X",
  M = "M",
  A = "A",
  S = "S",
  OTHER = ".",
}

const SEARCH = [SearchChar.X, SearchChar.M, SearchChar.A, SearchChar.S];
const DIRECTIONS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
] as const;

const countXmas = (grid: SparseGrid<SearchChar>, x: number, y: number) =>
  DIRECTIONS.filter((step) => {
    for (let i = 0; i < 4; i++) {
      if (grid.get(x + step[0] * i, y + step[1] * i) !== SEARCH[i]) {
        return false;
      }
    }
    return true;
  }).length;

export const partA: Solver = (lines: string[]) => {
  const grid = SparseGrid.fromLines(
    lines,
    (c) =>
      ["X", "M", "A", "S"].includes(c) ? (c as SearchChar) : SearchChar.OTHER,
    SearchChar.OTHER
  );

  const xs = grid.sparseCells().filter((c) => c.value === SearchChar.X);

  let count = 0;
  for (const x of xs) {
    count += countXmas(grid, x.x, x.y);
  }

  return count;
};

const isXMas = (grid: SparseGrid<SearchChar>, x: number, y: number) => {
  const hasFirstMas =
    (grid.get(x + 1, y + 1) === SearchChar.M &&
      grid.get(x - 1, y - 1) === SearchChar.S) ||
    (grid.get(x + 1, y + 1) === SearchChar.S &&
      grid.get(x - 1, y - 1) === SearchChar.M);
  const hasSecondMas =
    (grid.get(x - 1, y + 1) === SearchChar.M &&
      grid.get(x + 1, y - 1) === SearchChar.S) ||
    (grid.get(x - 1, y + 1) === SearchChar.S &&
      grid.get(x + 1, y - 1) === SearchChar.M);

  return hasFirstMas && hasSecondMas;
};

export const partB: Solver = (lines: string[]) => {
  const grid = SparseGrid.fromLines(
    lines,
    (c) =>
      ["X", "M", "A", "S"].includes(c) ? (c as SearchChar) : SearchChar.OTHER,
    SearchChar.OTHER
  );

  const as = grid.sparseCells().filter((c) => c.value === SearchChar.A);

  let count = 0;
  for (const a of as) {
    count += isXMas(grid, a.x, a.y) ? 1 : 0;
  }

  return count;
};
