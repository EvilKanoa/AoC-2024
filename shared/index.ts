import { file } from "bun";

export * from "./sparse-grid";
export * from "./key-by";
export * from "./math";
export * from "./pairs";
export * from "./default-list";

export type Solver = (lines: string[]) => number;

const parseFile = async (path: string) => {
  return (await file(path).text()).trim().split("\n");
};

const printSolution = (part: string, solution: number, time: number) => {
  console.log(`part ${part}: ${solution} (${time.toPrecision(4)}ms)`);
};

const measureSolver = (lines: string[], solver: Solver) => {
  const start = performance.now();
  const res = solver(lines);
  const end = performance.now();

  return {
    solution: res,
    time: end - start,
  };
};

export const runSolvers = async (partA: Solver, partB: Solver) => {
  const lines = await parseFile("./input.txt");

  const resA = measureSolver(lines, partA);
  printSolution("A", resA.solution, resA.time);

  const resB = measureSolver(lines, partB);
  printSolution("B", resB.solution, resB.time);
};
