import { Solver, SparseGrid } from "shared";

// \--- Day 16: The Floor Will Be Lava ---
// ---------------------------------------
//
// With the beam of light completely focused _somewhere_, the reindeer leads you deeper still into the Lava Production Facility. At some point, you realize that the steel facility walls have been replaced with cave, and the doorways are just cave, and the floor is cave, and you're pretty sure this is actually just a giant cave.
//
// Finally, as you approach what must be the heart of the mountain, you see a bright light in a cavern up ahead. There, you discover that the beam of light you so carefully focused is emerging from the cavern wall closest to the facility and pouring all of its energy into a contraption on the opposite side.
//
// Upon closer inspection, the contraption appears to be a flat, two-dimensional square grid containing _empty space_ (`.`), _mirrors_ (`/` and `\`), and _splitters_ (`|` and `-`).
//
// The contraption is aligned so that most of the beam bounces around the grid, but each tile on the grid converts some of the beam's light into _heat_ to melt the rock in the cavern.
//
// You note the layout of the contraption (your puzzle input). For example:
//
//     .|...\....
//     |.-.\.....
//     .....|-...
//     ........|.
//     ..........
//     .........\
//     ..../.\\..
//     .-.-/..|..
//     .|....-|.\
//     ..//.|....
//
//
// The beam enters in the top-left corner from the left and heading to the _right_. Then, its behavior depends on what it encounters as it moves:
//
// *   If the beam encounters _empty space_ (`.`), it continues in the same direction.
// *   If the beam encounters a _mirror_ (`/` or `\`), the beam is _reflected_ 90 degrees depending on the angle of the mirror. For instance, a rightward-moving beam that encounters a `/` mirror would continue _upward_ in the mirror's column, while a rightward-moving beam that encounters a `\` mirror would continue _downward_ from the mirror's column.
// *   If the beam encounters the _pointy end of a splitter_ (`|` or `-`), the beam passes through the splitter as if the splitter were _empty space_. For instance, a rightward-moving beam that encounters a `-` splitter would continue in the same direction.
// *   If the beam encounters the _flat side of a splitter_ (`|` or `-`), the beam is _split into two beams_ going in each of the two directions the splitter's pointy ends are pointing. For instance, a rightward-moving beam that encounters a `|` splitter would split into two beams: one that continues _upward_ from the splitter's column and one that continues _downward_ from the splitter's column.
//
// Beams do not interact with other beams; a tile can have many beams passing through it at the same time. A tile is _energized_ if that tile has at least one beam pass through it, reflect in it, or split in it.
//
// In the above example, here is how the beam of light bounces around the contraption:
//
//     >|<<<\....
//     |v-.\^....
//     .v...|->>>
//     .v...v^.|.
//     .v...v^...
//     .v...v^..\
//     .v../2\\..
//     <->-/vv|..
//     .|<<<2-|.\
//     .v//.|.v..
//
//
// Beams are only shown on empty tiles; arrows indicate the direction of the beams. If a tile contains beams moving in multiple directions, the number of distinct directions is shown instead. Here is the same diagram but instead only showing whether a tile is _energized_ (`#`) or not (`.`):
//
//     ######....
//     .#...#....
//     .#...#####
//     .#...##...
//     .#...##...
//     .#...##...
//     .#..####..
//     ########..
//     .#######..
//     .#...#.#..
//
//
// Ultimately, in this example, `_46_` tiles become _energized_.
//
// The light isn't energizing enough tiles to produce lava; to debug the contraption, you need to start by analyzing the current situation. With the beam starting in the top-left heading right, _how many tiles end up being energized?_

enum Cell {
  EMPTY = ".",
  MIRROR_FORWARD = "/",
  MIRROR_BACKWARD = "\\",
  SPLITTER_VERTICAL = "|",
  SPLITTER_HORIZONTAL = "-",
}

enum Direction {
  UP = "U",
  DOWN = "D",
  LEFT = "L",
  RIGHT = "R",
}

const DIRECTION_OFFSET = {
  [Direction.UP]: [0, -1],
  [Direction.DOWN]: [0, 1],
  [Direction.LEFT]: [-1, 0],
  [Direction.RIGHT]: [1, 0],
} as const;

const parseInput = (lines: string[]): SparseGrid<Cell> => {
  const grid = new SparseGrid<Cell>(Cell.EMPTY, (x) => x, 0);

  lines.forEach((line, y) =>
    [...line].forEach((c, x) => {
      grid.set(x, y, c as Cell);
    })
  );

  return grid;
};

const energize = (
  x: number,
  y: number,
  direction: Direction,
  energized: SparseGrid<{ [key in Direction]: boolean }>,
  grid: SparseGrid<Cell>,
  maxX: number,
  maxY: number
): void => {
  // base case:
  //   1. Beam goes outside contraption (x or y out of bounds)
  //   2. Already energized this cell in this direction
  if (
    x < 0 ||
    x > maxX ||
    y < 0 ||
    y > maxY ||
    energized.get(x, y)[direction]
  ) {
    return;
  }

  // update our energized status for this cell in this direction
  energized.update(x, y, (s) => ({ ...s, [direction]: true }));

  const nextDirections = (() => {
    switch (grid.get(x, y)) {
      case Cell.EMPTY:
        return [direction];
      case Cell.SPLITTER_HORIZONTAL:
        if (direction === Direction.LEFT || direction === Direction.RIGHT) {
          return [direction];
        } else {
          return [Direction.LEFT, Direction.RIGHT];
        }
      case Cell.SPLITTER_VERTICAL:
        if (direction === Direction.UP || direction === Direction.DOWN) {
          return [direction];
        } else {
          return [Direction.UP, Direction.DOWN];
        }
      case Cell.MIRROR_FORWARD:
        switch (direction) {
          case Direction.UP:
            return [Direction.RIGHT];
          case Direction.DOWN:
            return [Direction.LEFT];
          case Direction.RIGHT:
            return [Direction.UP];
          case Direction.LEFT:
            return [Direction.DOWN];
        }
      case Cell.MIRROR_BACKWARD:
        switch (direction) {
          case Direction.UP:
            return [Direction.LEFT];
          case Direction.DOWN:
            return [Direction.RIGHT];
          case Direction.RIGHT:
            return [Direction.DOWN];
          case Direction.LEFT:
            return [Direction.UP];
        }
    }
  })();

  nextDirections.forEach((direction) => {
    energize(
      x + DIRECTION_OFFSET[direction][0],
      y + DIRECTION_OFFSET[direction][1],
      direction,
      energized,
      grid,
      maxX,
      maxY
    );
  });
};

const getEnergizedCount = (
  grid: SparseGrid<Cell>,
  startX: number = 0,
  startY: number = 0,
  direction: Direction = Direction.RIGHT
): number => {
  const extents = grid.extents();
  const energized = new SparseGrid<{ [key in Direction]: boolean }>(
    { U: false, D: false, L: false, R: false },
    (s) => (s.D || s.U || s.L || s.R ? "#" : "."),
    0
  );
  energize(
    startX,
    startY,
    direction,
    energized,
    grid,
    extents[0][1],
    extents[1][1]
  );

  return energized
    .sparseCells()
    .filter(({ value }) => value.D || value.U || value.L || value.R).length;
};

export const partA: Solver = (lines: string[]) => {
  const grid = parseInput(lines);
  return getEnergizedCount(grid);
};

export const partB: Solver = (lines: string[]) => {
  const grid = parseInput(lines);
  const extents = grid.extents();
  const configurations: number[] = [];

  // from above and below
  for (let x = extents[0][0]; x <= extents[0][1]; x++) {
    configurations.push(
      getEnergizedCount(grid, x, extents[1][0], Direction.DOWN)
    );
    configurations.push(
      getEnergizedCount(grid, x, extents[1][1], Direction.UP)
    );
  }

  // from left and right
  for (let y = extents[1][0]; y <= extents[1][1]; y++) {
    configurations.push(
      getEnergizedCount(grid, extents[0][0], y, Direction.RIGHT)
    );
    configurations.push(
      getEnergizedCount(grid, extents[0][1], y, Direction.LEFT)
    );
  }

  return Math.max(...configurations);
};
