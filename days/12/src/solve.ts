import { SparseGrid, sum, type Solver } from "shared";

// \--- Day 12: Garden Groups ---
// ------------------------------
//
// Why not search for the Chief Historian near the [gardener](/2023/day/5) and his [massive farm](/2023/day/21)? There's plenty of food, so The Historians grab something to eat while they search.
//
// You're about to settle near a complex arrangement of garden plots when some Elves ask if you can lend a hand. They'd like to set up fences around each region of garden plots, but they can't figure out how much fence they need to order or how much it will cost. They hand you a map (your puzzle input) of the garden plots.
//
// Each garden plot grows only a single type of plant and is indicated by a single letter on your map. When multiple garden plots are growing the same type of plant and are touching (horizontally or vertically), they form a _region_. For example:
//
//     AAAA
//     BBCD
//     BBCC
//     EEEC
//
//
// This 4x4 arrangement includes garden plots growing five different types of plants (labeled `A`, `B`, `C`, `D`, and `E`), each grouped into their own region.
//
// In order to accurately calculate the cost of the fence around a single region, you need to know that region's _area_ and _perimeter_.
//
// The _area_ of a region is simply the number of garden plots the region contains. The above map's type `A`, `B`, and `C` plants are each in a region of area `4`. The type `E` plants are in a region of area `3`; the type `D` plants are in a region of area `1`.
//
// Each garden plot is a square and so has _four sides_. The _perimeter_ of a region is the number of sides of garden plots in the region that do not touch another garden plot in the same region. The type `A` and `C` plants are each in a region with perimeter `10`. The type `B` and `E` plants are each in a region with perimeter `8`. The lone `D` plot forms its own region with perimeter `4`.
//
// Visually indicating the sides of plots in each region that contribute to the perimeter using `-` and `|`, the above map's regions' perimeters are measured as follows:
//
//     +-+-+-+-+
//     |A A A A|
//     +-+-+-+-+     +-+
//                   |D|
//     +-+-+   +-+   +-+
//     |B B|   |C|
//     +   +   + +-+
//     |B B|   |C C|
//     +-+-+   +-+ +
//               |C|
//     +-+-+-+   +-+
//     |E E E|
//     +-+-+-+
//
//
// Plants of the same type can appear in multiple separate regions, and regions can even appear within other regions. For example:
//
//     OOOOO
//     OXOXO
//     OOOOO
//     OXOXO
//     OOOOO
//
//
// The above map contains _five_ regions, one containing all of the `O` garden plots, and the other four each containing a single `X` plot.
//
// The four `X` regions each have area `1` and perimeter `4`. The region containing `21` type `O` plants is more complicated; in addition to its outer edge contributing a perimeter of `20`, its boundary with each `X` region contributes an additional `4` to its perimeter, for a total perimeter of `36`.
//
// Due to "modern" business practices, the _price_ of fence required for a region is found by _multiplying_ that region's area by its perimeter. The _total price_ of fencing all regions on a map is found by adding together the price of fence for every region on the map.
//
// In the first example, region `A` has price `4 * 10 = 40`, region `B` has price `4 * 8 = 32`, region `C` has price `4 * 10 = 40`, region `D` has price `1 * 4 = 4`, and region `E` has price `3 * 8 = 24`. So, the total price for the first example is `_140_`.
//
// In the second example, the region with all of the `O` plants has price `21 * 36 = 756`, and each of the four smaller `X` regions has price `1 * 4 = 4`, for a total price of `_772_` (`756 + 4 + 4 + 4 + 4`).
//
// Here's a larger example:
//
//     RRRRIICCFF
//     RRRRIICCCF
//     VVRRRCCFFF
//     VVRCCCJFFF
//     VVVVCJJCFE
//     VVIVCCJJEE
//     VVIIICJJEE
//     MIIIIIJJEE
//     MIIISIJEEE
//     MMMISSJEEE
//
//
// It contains:
//
// *   A region of `R` plants with price `12 * 18 = 216`.
// *   A region of `I` plants with price `4 * 8 = 32`.
// *   A region of `C` plants with price `14 * 28 = 392`.
// *   A region of `F` plants with price `10 * 18 = 180`.
// *   A region of `V` plants with price `13 * 20 = 260`.
// *   A region of `J` plants with price `11 * 20 = 220`.
// *   A region of `C` plants with price `1 * 4 = 4`.
// *   A region of `E` plants with price `13 * 18 = 234`.
// *   A region of `I` plants with price `14 * 22 = 308`.
// *   A region of `M` plants with price `5 * 12 = 60`.
// *   A region of `S` plants with price `3 * 8 = 24`.
//
// So, it has a total price of `_1930_`.
//
// _What is the total price of fencing all regions on your map?_

const TILES = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;

const EMPTY = "." as const;

type EmptyTile = typeof EMPTY;
type Tile = (typeof TILES)[number];

export const partA: Solver = (lines: string[]) => {
  const map = SparseGrid.fromLines<Tile | EmptyTile>(
    lines,
    (c) => (TILES.includes(c as Tile) ? (c as Tile) : EMPTY),
    EMPTY
  );
  const q = map.clone();
  const area: Record<`${Tile}${number}`, number> = {};
  const perimeter: Record<`${Tile}${number}`, number> = {};
  const ids = TILES.reduce((acc, tile) => {
    acc[tile] = 0;
    return acc;
  }, {} as Record<Tile, number>);

  while (q.size()) {
    // biome-ignore lint/style/noNonNullAssertion:
    const seed = q.peek()!;
    if (seed.value === EMPTY) continue;

    const id = `${seed.value}${ids[seed.value]++}` as const;
    area[id] = 0;
    perimeter[id] = 0;
    const search = [seed];

    while (search.length) {
      // biome-ignore lint/style/noNonNullAssertion:
      const next = search.pop()!;
      if (!q.has(next.x, next.y)) continue;

      const neighbors = map
        .adjacent(next.x, next.y, 1, false)
        .filter((c) => c.value === seed.value);

      area[id]++;
      perimeter[id] += 4 - neighbors.length;
      q.remove(next.x, next.y);
      search.push(...neighbors.filter((n) => q.has(n.x, n.y)));
    }
  }

  return Object.entries(area)
    .map(([id, a]) => a * perimeter[id as keyof typeof area])
    .reduce(sum);
};

const CORNERS = [
  [
    [-1, 0],
    [0, -1],
  ],
  [
    [0, -1],
    [1, 0],
  ],
  [
    [1, 0],
    [0, 1],
  ],
  [
    [0, 1],
    [-1, 0],
  ],
] as const;

export const partB: Solver = (lines: string[]) => {
  const map = SparseGrid.fromLines<Tile | EmptyTile>(
    lines,
    (c) => (TILES.includes(c as Tile) ? (c as Tile) : EMPTY),
    EMPTY
  );
  const q = map.clone();
  const area: Record<`${Tile}${number}`, number> = {};
  const corners: Record<`${Tile}${number}`, number> = {};
  const ids = TILES.reduce((acc, tile) => {
    acc[tile] = 0;
    return acc;
  }, {} as Record<Tile, number>);

  while (q.size()) {
    // biome-ignore lint/style/noNonNullAssertion:
    const seed = q.peek()!;
    if (seed.value === EMPTY) continue;

    const id = `${seed.value}${ids[seed.value]++}` as const;
    area[id] = 0;
    corners[id] = 0;
    const search = [seed];

    while (search.length) {
      // biome-ignore lint/style/noNonNullAssertion:
      const next = search.pop()!;
      if (!q.has(next.x, next.y)) continue;

      area[id]++;
      corners[id] += CORNERS.map(([[x1, y1], [x2, y2]]) => [
        map.get(next.x + x1, next.y + y1),
        map.get(next.x + x2, next.y + y2),
        map.get(next.x + x1 + x2, next.y + y1 + y2),
      ]).filter(
        ([a, b, c]) =>
          (a !== next.value && b !== next.value) ||
          (a === next.value && b === next.value && c !== next.value)
      ).length;
      q.remove(next.x, next.y);
      search.push(
        ...map
          .adjacent(next.x, next.y, 1, false)
          .filter((n) => n.value === seed.value)
      );
    }
  }

  return Object.entries(area)
    .map(([id, a]) => a * corners[id as keyof typeof area])
    .reduce(sum);
};
