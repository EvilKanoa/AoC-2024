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

const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
] as const;

type Direction = 0 | 1 | 2 | 3;

const parseMap = (lines: string[]) =>
  SparseGrid.fromLines<number>(
    lines,
    (c) => parseInt(c),
    Number.MAX_SAFE_INTEGER,
    (c) => `${c !== Number.MAX_SAFE_INTEGER ? c : ""} `,
    0
  );

const dijkstra = (
  map: SparseGrid<number>,
  startX: number,
  startY: number,
  goalX: number,
  goalY: number,
  minDist: number,
  maxDist: number
) => {
  const extents = map.extents();
  const queue = new SparseGrid<[number, Direction | -1]>(() => [
    Number.MAX_SAFE_INTEGER,
    -1,
  ]).set(startX, startY, [0, -1]);
  const visited = new Set<`${GridKey},${number}`>();
  const costs = new Map<`${GridKey},${number}`, number>();

  while (queue.size()) {
    // TODO: make a heap-based priority queue if we really need it
    const current = queue.popBy(([d]) => -d);

    if (current.x === goalX && current.y === goalY) {
      return current.value;
    }

    const visitKey = `${current.x},${current.y},${current.value[1]}` as const;
    if (visited.has(visitKey)) {
      continue;
    }

    visited.add(visitKey);

    for (let direction = 0; direction < DIRECTIONS.length; direction++) {
      if (
        direction !== -1 &&
        (direction === current.value[1] || direction % 4 === 2)
      ) {
        continue;
      }

      let costChange = 0;
      for (let dist = 1; dist <= maxDist; dist++) {
        const newX = current.x + DIRECTIONS[direction][0] * dist;
        const newY = current.y + DIRECTIONS[direction][1] * dist;

        costChange += map.get(newX, newY);
        if (dist < minDist) {
          continue;
        }

        const cost = current.value[0] + costChange;
        if (
          (costs.get(`${newX},${newY},${direction}`) ??
            Number.MAX_SAFE_INTEGER) <= cost
        ) {
          continue;
        }

        costs.set(`${newX},${newY},${direction}`, cost);
        queue.set(newX, newY, [cost, direction as Direction]);
      }
    }
  }

  throw new Error("No path found!");
};

export const partA: Solver = (lines: string[]) => {
  const map = parseMap(lines);
  // TODO: not sure why but seemingly not getting the optimal path
  const result = dijkstra(
    map,
    0,
    0,
    map.extents()[0][1],
    map.extents()[1][1],
    1,
    3
  );
  return result[0];
};

export const partB: Solver = (lines: string[]) => {
  return 0;
};
