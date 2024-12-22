import { sum, type Solver } from "shared";

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

export const partA: Solver = (lines: string[]) => {
  const checks = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ] as const;
  const bounds = [lines[0].length - 1, lines.length - 1] as const;
  const area: Record<string, number> = {};
  const perimeter: Record<string, number> = {};

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      const tile = lines[y][x];

      area[tile] = (area[tile] ?? 0) + 1;
      perimeter[tile] =
        (perimeter[tile] ?? 0) +
        checks
          .map(([dx, dy]) => [x + dx, y + dy])
          .map<number>(([x, y]) =>
            x < 0 ||
            x > bounds[0] ||
            y < 0 ||
            y > bounds[1] ||
            lines[y][x] !== tile
              ? 1
              : 0
          )
          .reduce(sum);
    }
  }

  console.log("area", area);
  console.log("perimeter", perimeter);

  return Object.entries(area)
    .map(([region, area]) => area * perimeter[region])
    .reduce(sum);
};

//
export const partB: Solver = (lines: string[]) => {
  return 0;
};
