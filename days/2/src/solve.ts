import { Solver } from "shared";

const isGamePossible = (
  game: { red: number; green: number; blue: number }[]
): boolean =>
  game.every(({ red, green, blue }) => red <= 12 && green <= 13 && blue <= 14);

const parse = (
  line: string
): [number, { red: number; green: number; blue: number }[]] => {
  const match = line.match(/Game (\d+): (.*)/);

  if (match == null || match[1] == null || match[2] == null) {
    throw `Failed to match on line: ${line}...`;
  }

  const id = parseInt(match[1]);
  const games = match[2].split(";").map((game) => {
    const counts = game.split(",").reduce(
      (acc, pull) => {
        const match = pull.trim().match(/(\d+) (\w*)/);

        if (match == null || match[1] == null || match[2] == null) {
          throw `Failed to match on pull: ${pull}...`;
        }

        acc[match[2] as keyof typeof acc] += parseInt(match[1]);

        return acc;
      },
      { red: 0, green: 0, blue: 0 }
    );

    return counts;
  });

  return [id, games];
};

export const partA: Solver = (lines: string[]) =>
  lines
    .map(parse)
    .filter(([id, game]) => isGamePossible(game))
    .map(([id]) => id)
    .reduce((a, b) => a + b);

export const partB: Solver = (lines: string[]) =>
  lines
    .map(parse)
    .map(([id, game]) => {
      let red = 0,
        green = 0,
        blue = 0;
      game.forEach((pull) => {
        if (pull.red > red) red = pull.red;
        if (pull.green > green) green = pull.green;
        if (pull.blue > blue) blue = pull.blue;
      });

      return red * green * blue;
    })
    .reduce((a, b) => a + b);
