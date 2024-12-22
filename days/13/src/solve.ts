import { sum, type Solver, type Tuple } from "shared";

// \--- Day 13: Claw Contraption ---
// ---------------------------------
//
// Next up: the [lobby](/2020/day/24) of a resort on a tropical island. The Historians take a moment to admire the hexagonal floor tiles before spreading out.
//
// Fortunately, it looks like the resort has a new [arcade](https://en.wikipedia.org/wiki/Amusement_arcade)! Maybe you can win some prizes from the [claw machines](https://en.wikipedia.org/wiki/Claw_machine)?
//
// The claw machines here are a little unusual. Instead of a joystick or directional buttons to control the claw, these machines have two buttons labeled `A` and `B`. Worse, you can't just put in a token and play; it costs _3 tokens_ to push the `A` button and _1 token_ to push the `B` button.
//
// With a little experimentation, you figure out that each machine's buttons are configured to move the claw a specific amount to the _right_ (along the `X` axis) and a specific amount _forward_ (along the `Y` axis) each time that button is pressed.
//
// Each machine contains one _prize_; to win the prize, the claw must be positioned _exactly_ above the prize on both the `X` and `Y` axes.
//
// You wonder: what is the smallest number of tokens you would have to spend to win as many prizes as possible? You assemble a list of every machine's button behavior and prize location (your puzzle input). For example:
//
//     Button A: X+94, Y+34
//     Button B: X+22, Y+67
//     Prize: X=8400, Y=5400
//
//     Button A: X+26, Y+66
//     Button B: X+67, Y+21
//     Prize: X=12748, Y=12176
//
//     Button A: X+17, Y+86
//     Button B: X+84, Y+37
//     Prize: X=7870, Y=6450
//
//     Button A: X+69, Y+23
//     Button B: X+27, Y+71
//     Prize: X=18641, Y=10279
//
//
// This list describes the button configuration and prize location of four different claw machines.
//
// For now, consider just the first claw machine in the list:
//
// *   Pushing the machine's `A` button would move the claw `94` units along the `X` axis and `34` units along the `Y` axis.
// *   Pushing the `B` button would move the claw `22` units along the `X` axis and `67` units along the `Y` axis.
// *   The prize is located at `X=8400`, `Y=5400`; this means that from the claw's initial position, it would need to move exactly `8400` units along the `X` axis and exactly `5400` units along the `Y` axis to be perfectly aligned with the prize in this machine.
//
// The cheapest way to win the prize is by pushing the `A` button `80` times and the `B` button `40` times. This would line up the claw along the `X` axis (because `80*94 + 40*22 = 8400`) and along the `Y` axis (because `80*34 + 40*67 = 5400`). Doing this would cost `80*3` tokens for the `A` presses and `40*1` for the `B` presses, a total of `_280_` tokens.
//
// For the second and fourth claw machines, there is no combination of A and B presses that will ever win a prize.
//
// For the third claw machine, the cheapest way to win the prize is by pushing the `A` button `38` times and the `B` button `86` times. Doing this would cost a total of `_200_` tokens.
//
// So, the most prizes you could possibly win is two; the minimum tokens you would have to spend to win all (two) prizes is `_480_`.
//
// You estimate that each button would need to be pressed _no more than `100` times_ to win a prize. How else would someone be expected to play?
//
// Figure out how to win as many prizes as possible. _What is the fewest tokens you would have to spend to win all possible prizes?_

type Machine = {
  a: Tuple<number>;
  b: Tuple<number>;
  prize: Tuple<number>;
};

const simulate = (m: Machine, limit = true): number | null => {
  let best = Number.MAX_SAFE_INTEGER;
  for (
    let a = 0;
    a <=
    (limit
      ? 100
      : Math.min(
          Math.ceil(m.prize[0] / m.a[0]),
          Math.ceil(m.prize[1] / m.a[1])
        ));
    a++
  ) {
    for (
      let b = 0;
      b <=
      (limit
        ? 100
        : Math.min(
            Math.ceil((m.prize[0] - m.a[0] * a) / m.b[0]),
            Math.ceil((m.prize[1] - m.a[1] * a) / m.b[1])
          ));
      b++
    ) {
      const cost = a * 3 + b;
      if (
        m.prize[0] === m.a[0] * a + m.b[0] * b &&
        m.prize[1] === m.a[1] * a + m.b[1] * b &&
        best > cost
      )
        best = cost;
    }
  }

  return best === Number.MAX_SAFE_INTEGER ? null : best;
};

const parseInput = (lines: string[]): Machine[] =>
  lines
    .join("\n")
    .split("\n\n")
    .map((m) =>
      m.split("\n").map(
        (s) =>
          s
            .replace(/[^0-9,]/g, "")
            .split(",")
            .map((n) => Number.parseInt(n, 10)) as Tuple<number>
      )
    )
    .map(([a, b, prize]) => ({ a, b, prize }));

export const partA: Solver = (lines: string[]) => {
  const machines = parseInput(lines);
  return machines.map((m) => simulate(m) ?? 0).reduce(sum);
};

export const partB: Solver = (lines: string[]) => {
  const machines = parseInput(lines).map((m) => ({
    ...m,
    prize: [
      m.prize[0] + 10000000000000,
      m.prize[1] + 10000000000000,
    ] as Tuple<number>,
  }));
  return machines.map((m) => simulate(m) ?? 0).reduce(sum);
};
