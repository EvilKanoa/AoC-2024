import { Solver, SparseGrid, pointInPolygon } from "shared";

// \--- Day 10: Pipe Maze ---
// --------------------------
//
// You use the hang glider to ride the hot air from Desert Island all the way up to the floating metal island. This island is surprisingly cold and there definitely aren't any thermals to glide on, so you leave your hang glider behind.
//
// You wander around for a while, but you don't find any people or animals. However, you do occasionally find signposts labeled "[Hot Springs](https://en.wikipedia.org/wiki/Hot_spring)" pointing in a seemingly consistent direction; maybe you can find someone at the hot springs and ask them where the desert-machine parts are made.
//
// The landscape here is alien; even the flowers and trees are made of metal. As you stop to admire some metal grass, you notice something metallic scurry away in your peripheral vision and jump into a big pipe! It didn't look like any animal you've ever seen; if you want a better look, you'll need to get ahead of it.
//
// Scanning the area, you discover that the entire field you're standing on is densely packed with pipes; it was hard to tell at first because they're the same metallic silver color as the "ground". You make a quick sketch of all of the surface pipes you can see (your puzzle input).
//
// The pipes are arranged in a two-dimensional grid of _tiles_:
//
// *   `|` is a _vertical pipe_ connecting north and south.
// *   `-` is a _horizontal pipe_ connecting east and west.
// *   `L` is a _90-degree bend_ connecting north and east.
// *   `J` is a _90-degree bend_ connecting north and west.
// *   `7` is a _90-degree bend_ connecting south and west.
// *   `F` is a _90-degree bend_ connecting south and east.
// *   `.` is _ground_; there is no pipe in this tile.
// *   `S` is the _starting position_ of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.
//
// Based on the acoustics of the animal's scurrying, you're confident the pipe that contains the animal is _one large, continuous loop_.
//
// For example, here is a square loop of pipe:
//
//     .....
//     .F-7.
//     .|.|.
//     .L-J.
//     .....
//
//
// If the animal had entered this loop in the northwest corner, the sketch would instead look like this:
//
//     .....
//     .S-7.
//     .|.|.
//     .L-J.
//     .....
//
//
// In the above diagram, the `S` tile is still a 90-degree `F` bend: you can tell because of how the adjacent pipes connect to it.
//
// Unfortunately, there are also many pipes that _aren't connected to the loop_! This sketch shows the same loop as above:
//
//     -L|F7
//     7S-7|
//     L|7||
//     -L-J|
//     L|-JF
//
//
// In the above diagram, you can still figure out which pipes form the main loop: they're the ones connected to `S`, pipes those pipes connect to, pipes _those_ pipes connect to, and so on. Every pipe in the main loop connects to its two neighbors (including `S`, which will have exactly two pipes connecting to it, and which is assumed to connect back to those two pipes).
//
// Here is a sketch that contains a slightly more complex main loop:
//
//     ..F7.
//     .FJ|.
//     SJ.L7
//     |F--J
//     LJ...
//
//
// Here's the same example sketch with the extra, non-main-loop pipe tiles also shown:
//
//     7-F7-
//     .FJ|7
//     SJLL7
//     |F--J
//     LJ.LJ
//
//
// If you want to _get out ahead of the animal_, you should find the tile in the loop that is _farthest_ from the starting position. Because the animal is in the pipe, it doesn't make sense to measure this by direct distance. Instead, you need to find the tile that would take the longest number of steps _along the loop_ to reach from the starting point - regardless of which way around the loop the animal went.
//
// In the first example with the square loop:
//
//     .....
//     .S-7.
//     .|.|.
//     .L-J.
//     .....
//
//
// You can count the distance each tile in the loop is from the starting point like this:
//
//     .....
//     .012.
//     .1.3.
//     .234.
//     .....
//
//
// In this example, the farthest point from the start is `_4_` steps away.
//
// Here's the more complex loop again:
//
//     ..F7.
//     .FJ|.
//     SJ.L7
//     |F--J
//     LJ...
//
//
// Here are the distances for each tile on that loop:
//
//     ..45.
//     .236.
//     01.78
//     14567
//     23...
//
//
// Find the single giant loop starting at `S`. _How many steps along the loop does it take to get from the starting position to the point farthest from the starting position?_

enum Tile {
  VERTICAL = "|",
  HORIZONTAL = "-",
  NE_BEND = "L",
  NW_BEND = "J",
  SW_BEND = "7",
  SE_BEND = "F",
  GROUND = ".",
  START = "S",
}

interface MapTile {
  value: Tile;
  x: number;
  y: number;
}

const isCoordinateLikeEqual = (
  a: { x: number; y: number },
  b: { x: number; y: number }
) => a.x === b.x && a.y === b.y;

const isPipe = (
  tile: Tile
): tile is
  | Tile.VERTICAL
  | Tile.HORIZONTAL
  | Tile.NE_BEND
  | Tile.NW_BEND
  | Tile.SE_BEND
  | Tile.SW_BEND => tile !== Tile.GROUND && tile !== Tile.START;

const parseInput = (lines: string[]): SparseGrid<Tile> => {
  const grid = new SparseGrid(Tile.GROUND);
  lines.forEach((line, y) =>
    [...line].forEach((t, x) => {
      grid.set(x, y, t as Tile);
    })
  );
  return grid;
};

const VALID_STARTING_PIPE_OFFSETS = {
  [Tile.HORIZONTAL]: [
    [1, 0],
    [-1, 0],
  ],
  [Tile.VERTICAL]: [
    [0, 1],
    [0, -1],
  ],
  [Tile.NE_BEND]: [
    [1, 0],
    [0, -1],
  ],
  [Tile.NW_BEND]: [
    [-1, 0],
    [0, -1],
  ],
  [Tile.SE_BEND]: [
    [1, 0],
    [0, 1],
  ],
  [Tile.SW_BEND]: [
    [-1, 0],
    [0, 1],
  ],
} as Record<Tile, [number, number][]>;

const getStartingPipes = (
  grid: SparseGrid<Tile>
): { pipes: [MapTile, MapTile]; x: number; y: number } => {
  const start = grid.sparseCells().find(({ value }) => value === Tile.START)!;
  const pipes = grid
    .adjacent(start.x, start.y, 1, false)
    .filter(({ value }) => isPipe(value))
    .filter(({ x, y, value }) =>
      VALID_STARTING_PIPE_OFFSETS[value].some(
        ([offsetX, offsetY]) =>
          offsetX === start.x - x && offsetY === start.y - y
      )
    ) as [MapTile, MapTile];

  return { pipes, ...start };
};

const nextPipe = (
  grid: SparseGrid<Tile>,
  current: MapTile,
  last: { x: number; y: number }
): MapTile => {
  if (!isPipe(current.value)) {
    console.log(JSON.stringify({ current, last }, null, 2));
    throw new Error("Duhduhduh");
  }

  const movement = (() => {
    switch (current.value) {
      case Tile.HORIZONTAL:
        return last.x < current.x ? [1, 0] : [-1, 0];
      case Tile.VERTICAL:
        return last.y < current.y ? [0, 1] : [0, -1];
      case Tile.NE_BEND:
        return last.x === current.x ? [1, 0] : [0, -1];
      case Tile.NW_BEND:
        return last.x === current.x ? [-1, 0] : [0, -1];
      case Tile.SE_BEND:
        return last.x === current.x ? [1, 0] : [0, 1];
      case Tile.SW_BEND:
        return last.x === current.x ? [-1, 0] : [0, 1];
    }
  })();

  const position = { x: current.x + movement[0], y: current.y + movement[1] };

  return { ...position, value: grid.get(position.x, position.y) };
};

const findPath = (
  grid: SparseGrid<Tile>,
  start: ReturnType<typeof getStartingPipes>
): { halfSteps: number; path: [number, number][] } => {
  let halfSteps = 1;
  let headPrev: { x: number; y: number } = start;
  let tailPrev: { x: number; y: number } = start;
  let head = start.pipes[0];
  let tail = start.pipes[1];
  const pathHead: { x: number; y: number }[] = [start, head];
  const pathTail: { x: number; y: number }[] = [start, tail];

  while (
    !isCoordinateLikeEqual(head, tail) &&
    !isCoordinateLikeEqual(head, tailPrev) &&
    !isCoordinateLikeEqual(tail, headPrev)
  ) {
    const newHeadPrev = head;
    head = nextPipe(grid, head, headPrev);
    headPrev = newHeadPrev;
    pathHead.push(head);

    const newTailPrev = tail;
    tail = nextPipe(grid, tail, tailPrev);
    tailPrev = newTailPrev;
    if (!isCoordinateLikeEqual(head, tail)) {
      pathTail.push(tail);
    }

    halfSteps++;
  }

  return {
    halfSteps,
    path: [...pathHead, ...pathTail.reverse()].map(({ x, y }) => [x, y]),
  };
};

export const partA: Solver = (lines: string[]) => {
  const grid = parseInput(lines);
  const start = getStartingPipes(grid);
  const { halfSteps } = findPath(grid, start);

  return halfSteps;
};

export const partB: Solver = (lines: string[]) => {
  const grid = parseInput(lines);
  const start = getStartingPipes(grid);
  const { path } = findPath(grid, start);

  const within = grid
    .allCells(0)
    .filter(({ x, y }) => pointInPolygon(path, [x, y]) === -1);

  // fancy output
  // console.log(grid.toString());
  // within.forEach(({ x, y }) => {
  //   grid.set(x, y, "W" as Tile);
  // });
  // console.log(grid.toString());

  // const g = new SparseGrid<"P" | "." | "W">(".");
  // within.forEach(({ x, y }) => {
  //   g.set(x, y, "W");
  // });
  // path.forEach(([x, y]) => {
  //   g.set(x, y, "P");
  // });
  // console.log(g.toString());

  return within.length;
};
