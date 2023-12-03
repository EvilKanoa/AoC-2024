import { Solver } from "shared";

function isDigit(c: string) {
  return c >= "0" && c <= "9";
}

export const partA: Solver = (lines: string[]) => {
  const parts = lines.flatMap((line, y) => {
    const parts: [number, number, number][] = [];

    let partNumber = "";
    let partIndex = -1;
    const chars = [...line];
    for (let i = 0; i <= chars.length; i++) {
      if (i < chars.length && isDigit(chars[i])) {
        partNumber += chars[i];
        if (partIndex === -1) {
          partIndex = i;
        }
      } else if (partIndex !== -1) {
        const candidates = [];
        if (y > 0) {
          candidates.push(
            lines[y - 1].substring(
              Math.max(partIndex - 1, 0),
              Math.min(i + 1, lines[y - 1].length)
            )
          );
        }
        candidates.push(
          lines[y].substring(
            Math.max(partIndex - 1, 0),
            Math.min(i + 1, lines[y].length)
          )
        );
        if (y < lines.length - 1) {
          candidates.push(
            lines[y + 1].substring(
              Math.max(partIndex - 1, 0),
              Math.min(i + 1, lines[y + 1].length)
            )
          );
        }

        // console.log("Testing(" + i + "):\n" + candidates.join("\n"));

        if (
          partNumber.length &&
          candidates.some((c) => c.match(/[^0-9.]/) != null)
        ) {
          parts.push([parseInt(partNumber, 10), i, y]);
        }
        partNumber = "";
        partIndex = -1;
      }
    }

    return parts;
  });

  return parts.map(([part]) => part).reduce((a, b) => a + b);
};

export const partB: Solver = (lines: string[]) => {
  const gears: [number, number][] = [];
  const parts = lines.flatMap((line, y) => {
    const parts: [number, number, number][] = [];

    let partNumber = "";
    let partIndex = -1;
    const chars = [...line];
    for (let i = 0; i <= chars.length; i++) {
      if (i < chars.length && chars[i] === "*") {
        gears.push([i, y]);
      }

      if (i < chars.length && isDigit(chars[i])) {
        partNumber += chars[i];
        if (partIndex === -1) {
          partIndex = i;
        }
      } else if (partIndex !== -1) {
        const candidates = [];
        if (y > 0) {
          candidates.push(
            lines[y - 1].substring(
              Math.max(partIndex - 1, 0),
              Math.min(i + 1, lines[y - 1].length)
            )
          );
        }
        candidates.push(
          lines[y].substring(
            Math.max(partIndex - 1, 0),
            Math.min(i + 1, lines[y].length)
          )
        );
        if (y < lines.length - 1) {
          candidates.push(
            lines[y + 1].substring(
              Math.max(partIndex - 1, 0),
              Math.min(i + 1, lines[y + 1].length)
            )
          );
        }

        // console.log("Testing(" + i + "):\n" + candidates.join("\n"));

        if (
          partNumber.length &&
          candidates.some((c) => c.match(/[^0-9.]/) != null)
        ) {
          parts.push([parseInt(partNumber, 10), partIndex, y]);
        }
        partNumber = "";
        partIndex = -1;
      }
    }

    return parts;
  });

  const gearMap = gears.reduce((gearMap, [x, y]) => {
    gearMap[`${x},${y}`] = [];
    return gearMap;
  }, {} as Record<`${number},${number}`, number[]>);
  parts.forEach(([part, partX, partY]) => {
    for (let x = partX - 1; x < partX + `${part}`.length + 1; x++) {
      for (let y = partY - 1; y <= partY + 1; y++) {
        const key = `${x},${y}` as keyof typeof gearMap;
        if (key in gearMap) {
          gearMap[key].push(part);
          return;
        }
      }
    }
  });

  return Object.values(gearMap)
    .filter((connections) => connections.length > 1)
    .map((parts) => parts.reduce((a, b) => a * b))
    .reduce((a, b) => a + b);
};
