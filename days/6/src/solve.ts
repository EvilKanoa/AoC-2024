import {
  error,
  type GridCell,
  SparseGrid,
  type Tuple,
  type Solver,
} from "shared";

// \--- Day 6: Guard Gallivant ---
// -------------------------------
//
// The Historians use their fancy [device](4) again, this time to whisk you all away to the North Pole prototype suit manufacturing lab... in the year [1518](/2018/day/5)! It turns out that having direct access to history is very convenient for a group of historians.
//
// You still have to be careful of time paradoxes, and so it will be important to avoid anyone from 1518 while The Historians search for the Chief. Unfortunately, a single _guard_ is patrolling this part of the lab.
//
// Maybe you can work out where the guard will go ahead of time so that The Historians can search safely?
//
// You start by making a map (your puzzle input) of the situation. For example:
//
//     ....#.....
//     .........#
//     ..........
//     ..#.......
//     .......#..
//     ..........
//     .#..^.....
//     ........#.
//     #.........
//     ......#...
//
//
// The map shows the current position of the guard with `^` (to indicate the guard is currently facing _up_ from the perspective of the map). Any _obstructions_ - crates, desks, alchemical reactors, etc. - are shown as `#`.
//
// Lab guards in 1518 follow a very strict patrol protocol which involves repeatedly following these steps:
//
// *   If there is something directly in front of you, turn right 90 degrees.
// *   Otherwise, take a step forward.
//
// Following the above protocol, the guard moves up several times until she reaches an obstacle (in this case, a pile of failed suit prototypes):
//
//     ....#.....
//     ....^....#
//     ..........
//     ..#.......
//     .......#..
//     ..........
//     .#........
//     ........#.
//     #.........
//     ......#...
//
//
// Because there is now an obstacle in front of the guard, she turns right before continuing straight in her new facing direction:
//
//     ....#.....
//     ........>#
//     ..........
//     ..#.......
//     .......#..
//     ..........
//     .#........
//     ........#.
//     #.........
//     ......#...
//
//
// Reaching another obstacle (a spool of several _very_ long polymers), she turns right again and continues downward:
//
//     ....#.....
//     .........#
//     ..........
//     ..#.......
//     .......#..
//     ..........
//     .#......v.
//     ........#.
//     #.........
//     ......#...
//
//
// This process continues for a while, but the guard eventually leaves the mapped area (after walking past a tank of universal solvent):
//
//     ....#.....
//     .........#
//     ..........
//     ..#.......
//     .......#..
//     ..........
//     .#........
//     ........#.
//     #.........
//     ......#v..
//
//
// By predicting the guard's route, you can determine which specific positions in the lab will be in the patrol path. _Including the guard's starting position_, the positions visited by the guard before leaving the area are marked with an `X`:
//
//     ....#.....
//     ....XXXXX#
//     ....X...X.
//     ..#.X...X.
//     ..XXXXX#X.
//     ..X.X.X.X.
//     .#XXXXXXX.
//     .XXXXXXX#.
//     #XXXXXXX..
//     ......#X..
//
//
// In this example, the guard will visit `_41_` distinct positions on your map.
//
// Predict the path of the guard. _How many distinct positions will the guard visit before leaving the mapped area?_

enum Cell {
  // normal cell values
  EMPTY = ".",
  VISITED = "X",
  OBSTACLE = "#",

  // default value for anything out of bounds
  BOUNDS = "/",

  // guard visuals
  GUARD_UP = "^",
  GUARD_LEFT = "<",
  GUARD_RIGHT = ">",
  GUARD_DOWN = "v",
}

enum Direction {
  UP = 0,
  RIGHT = 1,
  DOWN = 2,
  LEFT = 3,
}

const walks: Record<Direction, Tuple<number>> = {
  [Direction.UP]: [0, -1],
  [Direction.DOWN]: [0, 1],
  [Direction.LEFT]: [-1, 0],
  [Direction.RIGHT]: [1, 0],
};

export const partA: Solver = (lines: string[]) => {
  const map = SparseGrid.fromLines(
    lines,
    (c) => (Object.values(Cell).includes(c as Cell) ? c : Cell.EMPTY),
    Cell.BOUNDS
  );
  let dir = Direction.UP;
  let { x, y } =
    map.sparseCells().find((c) => c.value === Cell.GUARD_UP) ??
    error<GridCell<Cell>>("No guard found!");
  map.set(x, y, Cell.VISITED);
  const bounds = map.extents();

  while (
    x >= bounds[0][0] &&
    x <= bounds[0][1] &&
    y >= bounds[1][0] &&
    y <= bounds[1][1]
  ) {
    const next = [x + walks[dir][0], y + walks[dir][1]];
    if (map.get(next[0], next[1]) === Cell.OBSTACLE) {
      dir = (dir + 1) % 4;
    } else {
      x = next[0];
      y = next[1];
      map.set(x, y, Cell.VISITED);
    }
  }

  // subtract 1 to account for guard leaving map
  return (
    map.sparseCells().filter(({ value }) => value === Cell.VISITED).length - 1
  );
};

const hasLoop = (
  map: SparseGrid<Cell>,
  startingDirection: Direction,
  startX: number,
  startY: number
): boolean => {
  const bounds = map.extents();
  const history = new Set<`${number},${number},${number}`>();
  let dir = startingDirection;
  let x = startX;
  let y = startY;

  while (
    x >= bounds[0][0] &&
    x <= bounds[0][1] &&
    y >= bounds[1][0] &&
    y <= bounds[1][1]
  ) {
    const next = [x + walks[dir][0], y + walks[dir][1]];
    if (map.get(next[0], next[1]) === Cell.OBSTACLE) {
      dir = (dir + 1) % 4;
    } else {
      x = next[0];
      y = next[1];
      const state = `${x},${y},${dir}` as const;
      if (history.has(state)) {
        return true;
      }
      history.add(state);
    }
  }

  return false;
};

// just do it for each cell eh
export const partB: Solver = (lines: string[]) => {
  const map = SparseGrid.fromLines<Cell>(
    lines,
    (c) => (Object.values(Cell).includes(c as Cell) ? (c as Cell) : Cell.EMPTY),
    Cell.BOUNDS
  );
  const dir = Direction.UP;
  const { x: startX, y: startY } =
    map.sparseCells().find((c) => c.value === Cell.GUARD_UP) ??
    error<GridCell<Cell>>("No guard found!");
  const bounds = map.extents();
  let loops = 0;

  for (let x = bounds[0][0]; x <= bounds[0][1]; x++) {
    for (let y = bounds[1][0]; y <= bounds[1][1]; y++) {
      if ((x === startX && y === startY) || map.get(x, y) === Cell.OBSTACLE) {
        continue;
      }

      if (hasLoop(map.clone().set(x, y, Cell.OBSTACLE), dir, startX, startY)) {
        loops++;
      }
    }
  }

  return loops;
};
