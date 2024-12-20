import { type GridCell, type Solver, SparseGrid, gcd, groupBy } from "shared";

// \--- Day 8: Resonant Collinearity ---
// -------------------------------------
//
// You find yourselves on the [roof](/2016/day/25) of a top-secret Easter Bunny installation.
//
// While The Historians do their thing, you take a look at the familiar _huge antenna_. Much to your surprise, it seems to have been reconfigured to emit a signal that makes people 0.1% more likely to buy Easter Bunny brand Imitation Mediocre Chocolate as a Christmas gift! Unthinkable!
//
// Scanning across the city, you find that there are actually many such antennas. Each antenna is tuned to a specific _frequency_ indicated by a single lowercase letter, uppercase letter, or digit. You create a map (your puzzle input) of these antennas. For example:
//
//     ............
//     ........0...
//     .....0......
//     .......0....
//     ....0.......
//     ......A.....
//     ............
//     ............
//     ........A...
//     .........A..
//     ............
//     ............
//
//
// The signal only applies its nefarious effect at specific _antinodes_ based on the resonant frequencies of the antennas. In particular, an antinode occurs at any point that is perfectly in line with two antennas of the same frequency - but only when one of the antennas is twice as far away as the other. This means that for any pair of antennas with the same frequency, there are two antinodes, one on either side of them.
//
// So, for these two antennas with frequency `a`, they create the two antinodes marked with `#`:
//
//     ..........
//     ...#......
//     ..........
//     ....a.....
//     ..........
//     .....a....
//     ..........
//     ......#...
//     ..........
//     ..........
//
//
// Adding a third antenna with the same frequency creates several more antinodes. It would ideally add four antinodes, but two are off the right side of the map, so instead it adds only two:
//
//     ..........
//     ...#......
//     #.........
//     ....a.....
//     ........a.
//     .....a....
//     ..#.......
//     ......#...
//     ..........
//     ..........
//
//
// Antennas with different frequencies don't create antinodes; `A` and `a` count as different frequencies. However, antinodes _can_ occur at locations that contain antennas. In this diagram, the lone antenna with frequency capital `A` creates no antinodes but has a lowercase-`a`\-frequency antinode at its location:
//
//     ..........
//     ...#......
//     #.........
//     ....a.....
//     ........a.
//     .....a....
//     ..#.......
//     ......A...
//     ..........
//     ..........
//
//
// The first example has antennas with two different frequencies, so the antinodes they create look like this, plus an antinode overlapping the topmost `A`\-frequency antenna:
//
//     ......#....#
//     ...#....0...
//     ....#0....#.
//     ..#....0....
//     ....0....#..
//     .#....A.....
//     ...#........
//     #......#....
//     ........A...
//     .........A..
//     ..........#.
//     ..........#.
//
//
// Because the topmost `A`\-frequency antenna overlaps with a `0`\-frequency antinode, there are `_14_` total unique locations that contain an antinode within the bounds of the map.
//
// Calculate the impact of the signal. _How many unique locations within the bounds of the map contain an antinode?_

interface Position {
  x: number;
  y: number;
}

const parseInput = (lines: string[]) => {
  const map = new SparseGrid(".");
  const maxY = lines.length - 1;
  let maxX = 0;
  lines.forEach((line, y) => {
    if (maxX === 0) maxX = [...line].length - 1;
    [...line].forEach((c, x) => {
      if (c !== ".") {
        map.set(x, y, c);
      }
    });
  });
  return [map, maxX, maxY] as const;
};

const generateAntinodes = (nodes: GridCell<string>[]): Position[] => {
  const antinodes: Position[] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const [n1, n2] = [nodes[i], nodes[j]];
      const [dx, dy] = [n2.x - n1.x, n2.y - n1.y];

      antinodes.push(
        { x: n1.x - dx, y: n1.y - dy },
        { x: n2.x + dx, y: n2.y + dy }
      );
    }
  }

  return antinodes;
};

const countUnique = (positions: Position[]): number => {
  const bag = new Set<`${number},${number}`>();
  for (const p of positions) {
    bag.add(`${p.x},${p.y}`);
  }
  return bag.size;
};

export const partA: Solver = (lines: string[]) => {
  const [map, maxX, maxY] = parseInput(lines);
  const nodes = groupBy(map.sparseCells(), "value");
  const antinodes = Object.values(nodes)
    .flatMap(generateAntinodes)
    .filter(({ x, y }) => x >= 0 && x <= maxX && y >= 0 && y <= maxY);

  return countUnique(antinodes);
};

const generateResonantAntinodes = (
  nodes: GridCell<string>[],
  antinodes: Set<`${number},${number}`>,
  maxX: number,
  maxY: number
) => {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const [n1, n2] = [nodes[i], nodes[j]];
      const [dx, dy] = [n2.x - n1.x, n2.y - n1.y];
      const div = gcd(dx, dy);
      const [sx, sy] = [dx / div, dy / div];

      let [x, y] = [n2.x, n2.y];
      while (x >= 0 && x <= maxX && y >= 0 && y <= maxY) {
        antinodes.add(`${x},${y}`);
        x += sx;
        y += sy;
      }

      [x, y] = [n1.x, n1.y];
      while (x >= 0 && x <= maxX && y >= 0 && y <= maxY) {
        antinodes.add(`${x},${y}`);
        x -= sx;
        y -= sy;
      }
    }
  }
};

export const partB: Solver = (lines: string[]) => {
  const [map, maxX, maxY] = parseInput(lines);
  const nodeGroups = groupBy(map.sparseCells(), "value");
  const antinodes = new Set<`${number},${number}`>();
  for (const nodes of Object.values(nodeGroups)) {
    generateResonantAntinodes(nodes, antinodes, maxX, maxY);
  }

  return antinodes.size;
};
