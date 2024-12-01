# AoC-2024

- Using TS
- Solutions in /days and uses the bun setup below

## TS/bun borrowed from [sventi555/aoc-2023](https://github.com/sventi555/aoc-2023)

## Setup

To install dependencies:

```bash
bun install
```

To add a new day:

```bash
bun run scaffold <day-num>
```

Simply copy the input into _input.txt_, then fill in the functions `partA` and
`partB` in _src/solve.ts_.

Additionally, add any test cases in _src/solve.test.ts_ to validate your
solution.

## Running

To run all solutions:

```bash
bun run solve
```

To run all test cases for solutions:

```bash
bun run test
```

To run commands for a specific day, add `--filter <DAY_NUM>`:

```bash
bun run solve --filter 1
```
