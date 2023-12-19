import { GridKey, MEMO_KEY_STATS, Solver, SparseGrid, memoize } from "shared";

// \--- Day 17: Clumsy Crucible ---
// --------------------------------
//
// The lava starts flowing rapidly once the Lava Production Facility is operational. As you leave, the reindeer offers you a parachute, allowing you to quickly reach Gear Island.
//
// As you descend, your bird's-eye view of Gear Island reveals why you had trouble finding anyone on your way up: half of Gear Island is empty, but the half below you is a giant factory city!
//
// You land near the gradually-filling pool of lava at the base of your new _lavafall_. Lavaducts will eventually carry the lava throughout the city, but to make use of it immediately, Elves are loading it into large [crucibles](https://en.wikipedia.org/wiki/Crucible) on wheels.
//
// The crucibles are top-heavy and pushed by hand. Unfortunately, the crucibles become very difficult to steer at high speeds, and so it can be hard to go in a straight line for very long.
//
// To get Desert Island the machine parts it needs as soon as possible, you'll need to find the best way to get the crucible _from the lava pool to the machine parts factory_. To do this, you need to minimize _heat loss_ while choosing a route that doesn't require the crucible to go in a _straight line_ for too long.
//
// Fortunately, the Elves here have a map (your puzzle input) that uses traffic patterns, ambient temperature, and hundreds of other parameters to calculate exactly how much heat loss can be expected for a crucible entering any particular city block.
//
// For example:
//
//     2413432311323
//     3215453535623
//     3255245654254
//     3446585845452
//     4546657867536
//     1438598798454
//     4457876987766
//     3637877979653
//     4654967986887
//     4564679986453
//     1224686865563
//     2546548887735
//     4322674655533
//
//
// Each city block is marked by a single digit that represents the _amount of heat loss if the crucible enters that block_. The starting point, the lava pool, is the top-left city block; the destination, the machine parts factory, is the bottom-right city block. (Because you already start in the top-left block, you don't incur that block's heat loss unless you leave that block and then return to it.)
//
// Because it is difficult to keep the top-heavy crucible going in a straight line for very long, it can move _at most three blocks_ in a single direction before it must turn 90 degrees left or right. The crucible also can't reverse direction; after entering each city block, it may only turn left, continue straight, or turn right.
//
// One way to _minimize heat loss_ is this path:
//
//     2>>34^>>>1323
//     32v>>>35v5623
//     32552456v>>54
//     3446585845v52
//     4546657867v>6
//     14385987984v4
//     44578769877v6
//     36378779796v>
//     465496798688v
//     456467998645v
//     12246868655<v
//     25465488877v5
//     43226746555v>
//
//
// This path never moves more than three consecutive blocks in the same direction and incurs a heat loss of only `_102_`.
//
// Directing the crucible from the lava pool to the machine parts factory, but not moving more than three consecutive blocks in the same direction, _what is the least heat loss it can incur?_

type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0;

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

const opposite = (dir: Direction) =>
  dir === Direction.UP
    ? Direction.DOWN
    : dir === Direction.DOWN
    ? Direction.UP
    : dir === Direction.LEFT
    ? Direction.RIGHT
    : Direction.LEFT;

const parseMap = (lines: string[]) =>
  SparseGrid.fromLines<number>(
    lines,
    (c) => parseInt(c),
    Number.MAX_SAFE_INTEGER
  );

const bruteforce = (map: SparseGrid<Digit>): number => {
  const extents = map.extents();

  const minimalFrom = memoize(
    (
      x: number,
      y: number,
      lastDirection: Direction,
      currentRun: number,
      visited: Set<GridKey>
    ): number => {
      if (
        visited.has(`${x},${y}`) ||
        currentRun >= 3 ||
        x < extents[0][0] ||
        x > extents[0][1] ||
        y < extents[1][0] ||
        y > extents[1][1]
      ) {
        return Number.MAX_SAFE_INTEGER;
      }

      if (x === extents[0][1] && y === extents[1][1]) {
        return 0;
      }

      const newVisited = new Set(visited).add(`${x},${y}`);

      // return minimal option given all possible ways
      const possibilities = Object.values(Direction)
        .filter((dir) => dir !== opposite(lastDirection))
        .map(
          (dir) =>
            [
              dir,
              x + DIRECTION_OFFSET[dir][0],
              y + DIRECTION_OFFSET[dir][1],
            ] as const
        )
        .map(
          ([dir, newX, newY]) =>
            map.get(newX, newY) +
            minimalFrom(
              newX,
              newY,
              dir,
              dir === lastDirection ? currentRun + 1 : 0,
              newVisited
            )
        );

      return Math.min(...possibilities);
    },
    true
  );

  const result = minimalFrom(0, 0, Direction.RIGHT, 0, new Set());
  console.log(minimalFrom[MEMO_KEY_STATS]);
  return result;
};

const dijkstra = (
  map: SparseGrid<number>,
  startX: number,
  startY: number,
  goalX: number,
  goalY: number
): number => {
  const queue = new SparseGrid<number>(Number.MAX_SAFE_INTEGER).set(
    startX,
    startY,
    0
  );
  const visited = new Set<GridKey>();

  while (queue.size()) {
    // TODO: make a heap-based priority queue if we really need it
    const current = queue.popBy((d) => -d);

    if (current.x === goalX && current.y === goalY) {
      return current.value;
    }

    visited.add(`${current.x},${current.y}`);
    console.log(`${current.x},${current.y}`);
    for (const neighbour of map.adjacent(current.x, current.y, 1, false)) {
      const cost = current.value + neighbour.value;
      if (queue.has(neighbour.x, neighbour.y)) {
        // replace/update existing entry with new cost or somein?
        queue.update(neighbour.x, neighbour.y, (prev) =>
          prev < cost ? prev : cost
        );
      } else if (!visited.has(`${neighbour.x},${neighbour.y}`)) {
        queue.set(neighbour.x, neighbour.y, cost);
      }
    }
  }

  throw new Error("No path found!");
};

export const partA: Solver = (lines: string[]) => {
  const map = parseMap(lines);
  // TODO: Need to account for max dist traveled forwards
  return dijkstra(map, 0, 0, map.extents()[0][1], map.extents()[1][1]);
};

export const partB: Solver = (lines: string[]) => {
  return 0;
};
