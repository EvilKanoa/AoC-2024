import { GridCell, SparseGrid, sum, type Solver } from "shared";

// \--- Day 10: Hoof It ---
// ------------------------
//
// You all arrive at a [Lava Production Facility](/2023/day/15) on a floating island in the sky. As the others begin to search the massive industrial complex, you feel a small nose boop your leg and look down to discover a reindeer wearing a hard hat.
//
// The reindeer is holding a book titled "Lava Island Hiking Guide". However, when you open the book, you discover that most of it seems to have been scorched by lava! As you're about to ask how you can help, the reindeer brings you a blank [topographic map](https://en.wikipedia.org/wiki/Topographic_map) of the surrounding area (your puzzle input) and looks up at you excitedly.
//
// Perhaps you can help fill in the missing hiking trails?
//
// The topographic map indicates the _height_ at each position using a scale from `0` (lowest) to `9` (highest). For example:
//
//     0123
//     1234
//     8765
//     9876
//
//
// Based on un-scorched scraps of the book, you determine that a good hiking trail is _as long as possible_ and has an _even, gradual, uphill slope_. For all practical purposes, this means that a _hiking trail_ is any path that starts at height `0`, ends at height `9`, and always increases by a height of exactly 1 at each step. Hiking trails never include diagonal steps - only up, down, left, or right (from the perspective of the map).
//
// You look up from the map and notice that the reindeer has helpfully begun to construct a small pile of pencils, markers, rulers, compasses, stickers, and other equipment you might need to update the map with hiking trails.
//
// A _trailhead_ is any position that starts one or more hiking trails - here, these positions will always have height `0`. Assembling more fragments of pages, you establish that a trailhead's _score_ is the number of `9`\-height positions reachable from that trailhead via a hiking trail. In the above example, the single trailhead in the top left corner has a score of `1` because it can reach a single `9` (the one in the bottom left).
//
// This trailhead has a score of `2`:
//
//     ...0...
//     ...1...
//     ...2...
//     6543456
//     7.....7
//     8.....8
//     9.....9
//
//
// (The positions marked `.` are impassable tiles to simplify these examples; they do not appear on your actual topographic map.)
//
// This trailhead has a score of `4` because every `9` is reachable via a hiking trail except the one immediately to the left of the trailhead:
//
//     ..90..9
//     ...1.98
//     ...2..7
//     6543456
//     765.987
//     876....
//     987....
//
//
// This topographic map contains _two_ trailheads; the trailhead at the top has a score of `1`, while the trailhead at the bottom has a score of `2`:
//
//     10..9..
//     2...8..
//     3...7..
//     4567654
//     ...8..3
//     ...9..2
//     .....01
//
//
// Here's a larger example:
//
//     89010123
//     78121874
//     87430965
//     96549874
//     45678903
//     32019012
//     01329801
//     10456732
//
//
// This larger example has 9 trailheads. Considering the trailheads in reading order, they have scores of `5`, `6`, `5`, `3`, `1`, `3`, `5`, `3`, and `5`. Adding these scores together, the sum of the scores of all trailheads is `_36_`.
//
// The reindeer gleefully carries over a protractor and adds it to the pile. _What is the sum of the scores of all trailheads on your topographic map?_

export const partA: Solver = (lines: string[]) => {
  const topo = SparseGrid.fromLines(lines, (c) => Number.parseInt(c, 10), -1);
  const trailheads = topo.sparseCells().filter((c) => c.value === 0);

  const reachableFrom = (
    x: number,
    y: number,
    destinations = new Set<`${number},${number}`>()
  ): Set<`${number},${number}`> => {
    const elevation = topo.get(x, y);
    if (elevation >= 9) {
      destinations.add(`${x},${y}`);
      return destinations;
    }

    const paths = topo
      .adjacent(x, y, 1, false)
      .filter((c) => c.value === elevation + 1);

    if (paths.length === 0) return destinations;

    for (const p of paths) {
      reachableFrom(p.x, p.y, destinations);
    }

    return destinations;
  };

  return trailheads.map((c) => reachableFrom(c.x, c.y).size).reduce(sum);
};

export const partB: Solver = (lines: string[]) => {
  const topo = SparseGrid.fromLines(lines, (c) => Number.parseInt(c, 10), -1);
  const trailheads = topo.sparseCells().filter((c) => c.value === 0);

  const scoreFrom = (x: number, y: number): number => {
    const elevation = topo.get(x, y);
    if (elevation >= 9) return 1;

    const paths = topo
      .adjacent(x, y, 1, false)
      .filter((c) => c.value === elevation + 1);

    if (paths.length === 0) return 0;

    return paths.map((p) => scoreFrom(p.x, p.y)).reduce(sum);
  };

  return trailheads.map((c) => scoreFrom(c.x, c.y)).reduce(sum);
};
