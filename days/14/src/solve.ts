import { Solver, SparseGrid } from "shared";

// \--- Day 14: Parabolic Reflector Dish ---
// -----------------------------------------
//
// You reach the place where all of the mirrors were pointing: a massive [parabolic reflector dish](https://en.wikipedia.org/wiki/Parabolic_reflector) attached to the side of another large mountain.
//
// The dish is made up of many small mirrors, but while the mirrors themselves are roughly in the shape of a parabolic reflector dish, each individual mirror seems to be pointing in slightly the wrong direction. If the dish is meant to focus light, all it's doing right now is sending it in a vague direction.
//
// This system must be what provides the energy for the lava! If you focus the reflector dish, maybe you can go where it's pointing and use the light to fix the lava production.
//
// Upon closer inspection, the individual mirrors each appear to be connected via an elaborate system of ropes and pulleys to a large metal platform below the dish. The platform is covered in large rocks of various shapes. Depending on their position, the weight of the rocks deforms the platform, and the shape of the platform controls which ropes move and ultimately the focus of the dish.
//
// In short: if you move the rocks, you can focus the dish. The platform even has a control panel on the side that lets you _tilt_ it in one of four directions! The rounded rocks (`O`) will roll when the platform is tilted, while the cube-shaped rocks (`#`) will stay in place. You note the positions of all of the empty spaces (`.`) and rocks (your puzzle input). For example:
//
//     O....#....
//     O.OO#....#
//     .....##...
//     OO.#O....O
//     .O.....O#.
//     O.#..O.#.#
//     ..O..#O..O
//     .......O..
//     #....###..
//     #OO..#....
//
//
// Start by tilting the lever so all of the rocks will slide _north_ as far as they will go:
//
//     OOOO.#.O..
//     OO..#....#
//     OO..O##..O
//     O..#.OO...
//     ........#.
//     ..#....#.#
//     ..O..#.O.O
//     ..O.......
//     #....###..
//     #....#....
//
//
// You notice that the support beams along the north side of the platform are _damaged_; to ensure the platform doesn't collapse, you should calculate the _total load_ on the north support beams.
//
// The amount of load caused by a single rounded rock (`O`) is equal to the number of rows from the rock to the south edge of the platform, including the row the rock is on. (Cube-shaped rocks (`#`) don't contribute to load.) So, the amount of load caused by each rock in each row is as follows:
//
//     OOOO.#.O.. 10
//     OO..#....#  9
//     OO..O##..O  8
//     O..#.OO...  7
//     ........#.  6
//     ..#....#.#  5
//     ..O..#.O.O  4
//     ..O.......  3
//     #....###..  2
//     #....#....  1
//
//
// The total load is the sum of the load caused by all of the _rounded rocks_. In this example, the total load is `_136_`.
//
// Tilt the platform so that the rounded rocks all roll north. Afterward, _what is the total load on the north support beams?_

enum Piece {
  ROUND_ROCK = "O",
  CUBE_ROCK = "#",
  EMPTY = ".",
}

const isPlatformPiece = (s: string): s is Piece =>
  s === Piece.ROUND_ROCK || s === Piece.CUBE_ROCK || s === Piece.EMPTY;

const parseInput = (lines: string[]): SparseGrid<Piece> => {
  const platform = new SparseGrid<Piece>(Piece.EMPTY);
  lines.forEach((line, y) =>
    [...line].filter(isPlatformPiece).forEach((c, x) => {
      platform.set(x, y, c);
    })
  );
  return platform;
};

const tiltNorth = (platform: SparseGrid<Piece>): SparseGrid<Piece> => {
  const tilted = platform.clone();
  const extents = tilted.extents();

  // apply tilt to each vertical column
  for (let x = extents[0][0]; x <= extents[0][1]; x++) {
    // apply column tilt starting from top (y = 0) to bottom, one rock/cell at a time
    for (let y = 0; y <= extents[1][1]; y++) {
      // no action needed if current piece is not a round rock
      if (tilted.get(x, y) !== Piece.ROUND_ROCK) {
        continue;
      }

      let nextY = y;
      while (nextY > 0 && tilted.get(x, nextY - 1) === Piece.EMPTY) {
        nextY--;
      }

      tilted.remove(x, y);
      tilted.set(x, nextY, Piece.ROUND_ROCK);
    }
  }

  return tilted;
};

const spin = (platform: SparseGrid<Piece>): void => {
  const extents = platform.extents();

  // north tilt: apply tilt to each vertical column
  for (let x = extents[0][0]; x <= extents[0][1]; x++) {
    // apply column tilt starting from top (y = 0) to bottom, one rock/cell at a time
    for (let y = 0; y <= extents[1][1]; y++) {
      // no action needed if current piece is not a round rock
      if (platform.get(x, y) !== Piece.ROUND_ROCK) {
        continue;
      }

      let nextY = y;
      while (nextY > 0 && platform.get(x, nextY - 1) === Piece.EMPTY) {
        nextY--;
      }

      platform.remove(x, y);
      platform.set(x, nextY, Piece.ROUND_ROCK);
    }
  }

  // west tilt: apply tilt to each horizontal row
  for (let y = extents[1][0]; y <= extents[1][1]; y++) {
    // apply row tilt starting from left (x = 0) to right, one rock/cell at a time
    for (let x = 0; x <= extents[0][1]; x++) {
      // no action needed if current piece is not a round rock
      if (platform.get(x, y) !== Piece.ROUND_ROCK) {
        continue;
      }

      let nextX = x;
      while (nextX > 0 && platform.get(nextX - 1, y) === Piece.EMPTY) {
        nextX--;
      }

      platform.remove(x, y);
      platform.set(nextX, y, Piece.ROUND_ROCK);
    }
  }

  // south tilt: apply tilt to each vertical column
  for (let x = extents[0][0]; x <= extents[0][1]; x++) {
    // apply column tilt starting from bottom (y = extents[1][1]) to top (y = 0), one rock/cell at a time
    for (let y = extents[1][1]; y >= 0; y--) {
      // no action needed if current piece is not a round rock
      if (platform.get(x, y) !== Piece.ROUND_ROCK) {
        continue;
      }

      let nextY = y;
      while (
        nextY < extents[1][1] &&
        platform.get(x, nextY + 1) === Piece.EMPTY
      ) {
        nextY++;
      }

      platform.remove(x, y);
      platform.set(x, nextY, Piece.ROUND_ROCK);
    }
  }

  // east tilt: apply tilt to each horizontal row
  for (let y = extents[1][0]; y <= extents[1][1]; y++) {
    // apply row tilt starting from right (x = extents[0][1]) to left (x = 0), one rock/cell at a time
    for (let x = extents[0][1]; x >= 0; x--) {
      // no action needed if current piece is not a round rock
      if (platform.get(x, y) !== Piece.ROUND_ROCK) {
        continue;
      }

      let nextX = x;
      while (
        nextX < extents[0][1] &&
        platform.get(nextX + 1, y) === Piece.EMPTY
      ) {
        nextX++;
      }

      platform.remove(x, y);
      platform.set(nextX, y, Piece.ROUND_ROCK);
    }
  }
};

const getLoadNorth = (platform: SparseGrid<Piece>): number => {
  const maxY = platform.extents()[1][1] + 1;
  let load = 0;

  platform.eachSparse((_x, y, type) => {
    if (type !== Piece.ROUND_ROCK) {
      return;
    }

    load += maxY - y;
  });

  return load;
};

const findCycle = (
  platform: SparseGrid<Piece>
): { start: number; length: number } => {
  const platformAtCycle = [platform.clone()];

  for (let cycle = 0; cycle < 1_000_000_000; cycle++) {
    spin(platform);

    // check if we have a matching prior state
    const start = platformAtCycle.findIndex((p) => p.equals(platform));
    if (start !== -1) {
      console.log(start, cycle - start);
      return { start, length: cycle - start };
    }

    platformAtCycle.push(platform.clone());
  }

  throw new Error("No cycle found!");
};

export const partA: Solver = (lines: string[]) =>
  getLoadNorth(tiltNorth(parseInput(lines)));

export const partB: Solver = (lines: string[]) => {
  const platform = parseInput(lines);
  const cycleData = findCycle(platform);
  console.log(
    `Cycle starts at ${cycleData.start} with a length of ${cycleData.length}!`
  );
  let cycle = cycleData.start;

  while (cycle < 1_000_000_000 - cycleData.length) {
    cycle += cycleData.length;
  }

  while (cycle <= 1_000_000_000) {
    spin(platform);
    cycle++;
  }

  return getLoadNorth(platform);
};
