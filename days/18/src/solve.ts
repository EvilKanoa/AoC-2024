import { Solver, SparseGrid, pointInPolygon, polygonArea } from "shared";

// \--- Day 18: Lavaduct Lagoon ---
// --------------------------------
//
// Thanks to your efforts, the machine parts factory is one of the first factories up and running since the lavafall came back. However, to catch up with the large backlog of parts requests, the factory will also need a _large supply of lava_ for a while; the Elves have already started creating a large lagoon nearby for this purpose.
//
// However, they aren't sure the lagoon will be big enough; they've asked you to take a look at the _dig plan_ (your puzzle input). For example:
//
//     R 6 (#70c710)
//     D 5 (#0dc571)
//     L 2 (#5713f0)
//     D 2 (#d2c081)
//     R 2 (#59c680)
//     D 2 (#411b91)
//     L 5 (#8ceee2)
//     U 2 (#caa173)
//     L 1 (#1b58a2)
//     U 2 (#caa171)
//     R 2 (#7807d2)
//     U 3 (#a77fa3)
//     L 2 (#015232)
//     U 2 (#7a21e3)
//
//
// The digger starts in a 1 meter cube hole in the ground. They then dig the specified number of meters _up_ (`U`), _down_ (`D`), _left_ (`L`), or _right_ (`R`), clearing full 1 meter cubes as they go. The directions are given as seen from above, so if "up" were north, then "right" would be east, and so on. Each trench is also listed with _the color that the edge of the trench should be painted_ as an [RGB hexadecimal color code](https://en.wikipedia.org/wiki/RGB_color_model#Numeric_representations).
//
// When viewed from above, the above example dig plan would result in the following loop of _trench_ (`#`) having been dug out from otherwise _ground-level terrain_ (`.`):
//
//     #######
//     #.....#
//     ###...#
//     ..#...#
//     ..#...#
//     ###.###
//     #...#..
//     ##..###
//     .#....#
//     .######
//
//
// At this point, the trench could contain 38 cubic meters of lava. However, this is just the edge of the lagoon; the next step is to _dig out the interior_ so that it is one meter deep as well:
//
//     #######
//     #######
//     #######
//     ..#####
//     ..#####
//     #######
//     #####..
//     #######
//     .######
//     .######
//
//
// Now, the lagoon can contain a much more respectable `_62_` cubic meters of lava. While the interior is dug out, the edges are also painted according to the color codes in the dig plan.
//
// The Elves are concerned the lagoon won't be large enough; if they follow their dig plan, _how many cubic meters of lava could it hold?_

type Path = [number, number][];

interface PathEntry {
  dir: Direction;
  dist: number;
  color: string;
}

type Direction = "U" | "D" | "R" | "L";

const ENCODED_DIRECTION = { "0": "R", "1": "D", "2": "L", "3": "U" } as Record<
  string,
  Direction
>;

const DIRECTION_OFFSET = {
  U: [0, -1],
  D: [0, 1],
  L: [-1, 0],
  R: [1, 0],
} as const;

interface Input {
  path: Path;
  map: SparseGrid<string>;
}

const parseLineA = (line: string): PathEntry => {
  const [dirStr, distStr, colorStr] = line.split(" ");

  return {
    dir: dirStr as Direction,
    dist: parseInt(distStr, 10),
    color: colorStr.slice(1, 8),
  };
};

const parseLineB = (line: string): PathEntry => {
  const encoded = line.split(" ")[2];

  return {
    dir: ENCODED_DIRECTION[encoded.slice(7, 8)],
    dist: parseInt(encoded.slice(2, 7), 16),
    color: "U",
  };
};

const parseInputB = (lines: string[]): Input & { perimeter: number } => {
  let x = 0;
  let y = 0;
  let perimeter = 0;
  const path: Path = [[x, y]];
  const map = new SparseGrid<string>("", (c) => (c === "" ? "." : "#"));

  for (const line of lines.map(parseLineB)) {
    [x, y] = [
      x + DIRECTION_OFFSET[line.dir][0] * line.dist,
      y + DIRECTION_OFFSET[line.dir][1] * line.dist,
    ];
    path.push([x, y]);
    map.set(x, y, line.color);
    perimeter += line.dist;
  }

  return { path, map, perimeter };
};

const parseInput = (lines: string[], lineParser = parseLineA): Input => {
  let x = 0;
  let y = 0;
  const path: Path = [[x, y]];
  const map = new SparseGrid<string>("", (c) => (c === "" ? "." : "#"));

  for (const line of lines.map(lineParser)) {
    for (let i = 0; i < line.dist; i++) {
      [x, y] = [
        x + DIRECTION_OFFSET[line.dir][0],
        y + DIRECTION_OFFSET[line.dir][1],
      ];
      path.push([x, y]);
      map.set(x, y, line.color);
    }
  }

  return { path, map };
};

const fill = (input: Input): SparseGrid<string> => {
  const filled = input.map.clone();

  input.map.eachCell((x, y) => {
    if (pointInPolygon(input.path, [x, y]) === -1) {
      filled.set(x, y, "F");
    }
  });

  return filled;
};

export const partA: Solver = (lines: string[]) => {
  const input = parseInput(lines);
  const filled = fill(input);
  return filled.sparseCells().length;
};

export const partB: Solver = (lines: string[]) => {
  const input = parseInputB(lines);
  return polygonArea(input.path) + input.perimeter / 2 + 1;
};
