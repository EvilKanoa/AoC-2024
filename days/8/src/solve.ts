import { Solver, lcm } from "shared";

// \--- Day 8: Haunted Wasteland ---
// ---------------------------------
//
// You're still riding a camel across Desert Island when you spot a sandstorm quickly approaching. When you turn to warn the Elf, she disappears before your eyes! To be fair, she had just finished warning you about _ghosts_ a few minutes ago.
//
// One of the camel's pouches is labeled "maps" - sure enough, it's full of documents (your puzzle input) about how to navigate the desert. At least, you're pretty sure that's what they are; one of the documents contains a list of left/right instructions, and the rest of the documents seem to describe some kind of _network_ of labeled nodes.
//
// It seems like you're meant to use the _left/right_ instructions to _navigate the network_. Perhaps if you have the camel follow the same instructions, you can escape the haunted wasteland!
//
// After examining the maps for a bit, two nodes stick out: `AAA` and `ZZZ`. You feel like `AAA` is where you are now, and you have to follow the left/right instructions until you reach `ZZZ`.
//
// This format defines each _node_ of the network individually. For example:
//
//     RL
//
//     AAA = (BBB, CCC)
//     BBB = (DDD, EEE)
//     CCC = (ZZZ, GGG)
//     DDD = (DDD, DDD)
//     EEE = (EEE, EEE)
//     GGG = (GGG, GGG)
//     ZZZ = (ZZZ, ZZZ)
//
//
// Starting with `AAA`, you need to _look up the next element_ based on the next left/right instruction in your input. In this example, start with `AAA` and go _right_ (`R`) by choosing the right element of `AAA`, `_CCC_`. Then, `L` means to choose the _left_ element of `CCC`, `_ZZZ_`. By following the left/right instructions, you reach `ZZZ` in `_2_` steps.
//
// Of course, you might not find `ZZZ` right away. If you run out of left/right instructions, repeat the whole sequence of instructions as necessary: `RL` really means `RLRLRLRLRLRLRLRL...` and so on. For example, here is a situation that takes `_6_` steps to reach `ZZZ`:
//
//     LLR
//
//     AAA = (BBB, BBB)
//     BBB = (AAA, ZZZ)
//     ZZZ = (ZZZ, ZZZ)
//
//
// Starting at `AAA`, follow the left/right instructions. _How many steps are required to reach `ZZZ`?_

type Direction = "L" | "R";
type Path = Direction[];
type Node = string;
type Map = Record<
  Node,
  {
    L: Node;
    R: Node;
    start?: boolean;
    end?: boolean;
  }
>;
interface Data {
  path: Path;
  map: Map;
}

const parseInput = (lines: string[]): Data => {
  const path = [...lines[0].trim()].filter(
    (c): c is Direction => c === "L" || c === "R"
  );

  const map = lines
    .slice(2)
    .map((line) => ({
      node: line.substring(0, 3),
      L: line.substring(7, 10),
      R: line.substring(12, 15),
    }))
    .reduce((acc, node) => {
      acc[node.node] = { L: node.L, R: node.R };

      if (node.node.charAt(2) === "A") acc[node.node].start = true;
      if (node.node.charAt(2) === "Z") acc[node.node].end = true;

      return acc;
    }, {} as Map);

  return { map, path };
};

export const partA: Solver = (lines: string[]) => {
  const data = parseInput(lines);

  let steps = 0;
  let current: Node = "AAA";

  while (current !== "ZZZ") {
    current = data.map[current][data.path[steps % data.path.length]];
    steps++;
  }

  return steps;
};

export const partB: Solver = (lines: string[]) => {
  const data = parseInput(lines);

  let steps = 0;
  let cycleCount = 0;
  const current: Node[] = Object.entries(data.map)
    .filter(([, { start }]) => start)
    .map(([node]) => node);
  const visited = [...Array(current.length).keys()].map(
    () => new Map<`${Node},${number}`, number>()
  );
  const cycles: ({
    steps: number;
    start: number;
    end: number;
    length: number;
  } | null)[] = [...Array(current.length).keys()].map(() => null);
  const endPositions: number[][] = [...Array(current.length).keys()].map(
    () => []
  );

  while (cycleCount < current.length) {
    for (let i = 0; i < current.length; i++) {
      if (cycles[i] != null) continue;

      if (data.map[current[i]].end) {
        endPositions[i].push(steps);
      }

      visited[i].set(`${current[i]},${steps % data.path.length}`, steps);
      current[i] = data.map[current[i]][data.path[steps % data.path.length]];

      if (visited[i].has(`${current[i]},${(steps + 1) % data.path.length}`)) {
        cycles[i] = {
          steps: (steps + 1) % data.path.length,
          start: visited[i].get(
            `${current[i]},${(steps + 1) % data.path.length}`
          )!,
          end: steps + 1,
          length:
            steps +
            1 -
            visited[i].get(`${current[i]},${(steps + 1) % data.path.length}`)!,
        };
        cycleCount++;
      }
    }

    steps++;
  }

  // tbh i just tried each cycle property into lcm until it worked, counting is confusing
  return (cycles as Exclude<(typeof cycles)[number], null>[])
    .map((cycle) => cycle.length)
    .reduce(lcm);
};
