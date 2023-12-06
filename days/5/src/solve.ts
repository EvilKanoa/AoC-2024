import { Solver } from "shared";

// \--- Day 5: If You Give A Seed A Fertilizer ---
// -----------------------------------------------
//
// You take the boat and find the gardener right where you were told he would be: managing a giant "garden" that looks more to you like a farm.
//
// "A water source? Island Island _is_ the water source!" You point out that Snow Island isn't receiving any water.
//
// "Oh, we had to stop the water because we _ran out of sand_ to [filter](https://en.wikipedia.org/wiki/Sand_filter) it with! Can't make snow with dirty water. Don't worry, I'm sure we'll get more sand soon; we only turned off the water a few days... weeks... oh no." His face sinks into a look of horrified realization.
//
// "I've been so busy making sure everyone here has food that I completely forgot to check why we stopped getting more sand! There's a ferry leaving soon that is headed over in that direction - it's much faster than your boat. Could you please go check it out?"
//
// You barely have time to agree to this request when he brings up another. "While you wait for the ferry, maybe you can help us with our _food production problem_. The latest Island Island [Almanac](https://en.wikipedia.org/wiki/Almanac) just arrived and we're having trouble making sense of it."
//
// The almanac (your puzzle input) lists all of the seeds that need to be planted. It also lists what type of soil to use with each kind of seed, what type of fertilizer to use with each kind of soil, what type of water to use with each kind of fertilizer, and so on. Every type of seed, soil, fertilizer and so on is identified with a number, but numbers are reused by each category - that is, soil `123` and fertilizer `123` aren't necessarily related to each other.
//
// For example:
//
//     seeds: 79 14 55 13
//
//     seed-to-soil map:
//     50 98 2
//     52 50 48
//
//     soil-to-fertilizer map:
//     0 15 37
//     37 52 2
//     39 0 15
//
//     fertilizer-to-water map:
//     49 53 8
//     0 11 42
//     42 0 7
//     57 7 4
//
//     water-to-light map:
//     88 18 7
//     18 25 70
//
//     light-to-temperature map:
//     45 77 23
//     81 45 19
//     68 64 13
//
//     temperature-to-humidity map:
//     0 69 1
//     1 0 69
//
//     humidity-to-location map:
//     60 56 37
//     56 93 4
//
//
// The almanac starts by listing which seeds need to be planted: seeds `79`, `14`, `55`, and `13`.
//
// The rest of the almanac contains a list of _maps_ which describe how to convert numbers from a _source category_ into numbers in a _destination category_. That is, the section that starts with `seed-to-soil map:` describes how to convert a _seed number_ (the source) to a _soil number_ (the destination). This lets the gardener and his team know which soil to use with which seeds, which water to use with which fertilizer, and so on.
//
// Rather than list every source number and its corresponding destination number one by one, the maps describe entire _ranges_ of numbers that can be converted. Each line within a map contains three numbers: the _destination range start_, the _source range start_, and the _range length_.
//
// Consider again the example `seed-to-soil map`:
//
//     50 98 2
//     52 50 48
//
//
// The first line has a _destination range start_ of `50`, a _source range start_ of `98`, and a _range length_ of `2`. This line means that the source range starts at `98` and contains two values: `98` and `99`. The destination range is the same length, but it starts at `50`, so its two values are `50` and `51`. With this information, you know that seed number `98` corresponds to soil number `50` and that seed number `99` corresponds to soil number `51`.
//
// The second line means that the source range starts at `50` and contains `48` values: `50`, `51`, ..., `96`, `97`. This corresponds to a destination range starting at `52` and also containing `48` values: `52`, `53`, ..., `98`, `99`. So, seed number `53` corresponds to soil number `55`.
//
// Any source numbers that _aren't mapped_ correspond to the _same_ destination number. So, seed number `10` corresponds to soil number `10`.
//
// So, the entire list of seed numbers and their corresponding soil numbers looks like this:
//
//     seed  soil
//     0     0
//     1     1
//     ...   ...
//     48    48
//     49    49
//     50    52
//     51    53
//     ...   ...
//     96    98
//     97    99
//     98    50
//     99    51
//
//
// With this map, you can look up the soil number required for each initial seed number:
//
// *   Seed number `79` corresponds to soil number `81`.
// *   Seed number `14` corresponds to soil number `14`.
// *   Seed number `55` corresponds to soil number `57`.
// *   Seed number `13` corresponds to soil number `13`.
//
// The gardener and his team want to get started as soon as possible, so they'd like to know the closest location that needs a seed. Using these maps, find _the lowest location number that corresponds to any of the initial seeds_. To do this, you'll need to convert each seed number through other categories until you can find its corresponding _location number_. In this example, the corresponding types are:
//
// *   Seed `79`, soil `81`, fertilizer `81`, water `81`, light `74`, temperature `78`, humidity `78`, _location `82`_.
// *   Seed `14`, soil `14`, fertilizer `53`, water `49`, light `42`, temperature `42`, humidity `43`, _location `43`_.
// *   Seed `55`, soil `57`, fertilizer `57`, water `53`, light `46`, temperature `82`, humidity `82`, _location `86`_.
// *   Seed `13`, soil `13`, fertilizer `52`, water `41`, light `34`, temperature `34`, humidity `35`, _location `35`_.
//
// So, the lowest location number in this example is `_35_`.
//
// _What is the lowest location number that corresponds to any of the initial seed numbers?_

type RangedMap = Array<{
  start: number;
  end: number;
  offset: number;
}>;

interface Almanac {
  seeds: number[];
  ["seed-to-soil"]: RangedMap;
  ["soil-to-fertilizer"]: RangedMap;
  ["fertilizer-to-water"]: RangedMap;
  ["water-to-light"]: RangedMap;
  ["light-to-temperature"]: RangedMap;
  ["temperature-to-humidity"]: RangedMap;
  ["humidity-to-location"]: RangedMap;
}

const MAP_ORDER = [
  "seed-to-soil",
  "soil-to-fertilizer",
  "fertilizer-to-water",
  "water-to-light",
  "light-to-temperature",
  "temperature-to-humidity",
  "humidity-to-location",
] as const;

const getMappedValue = (map: RangedMap, source: number): number => {
  for (const mapping of map) {
    if (source >= mapping.start && source <= mapping.end) {
      return source + mapping.offset;
    }
  }
  return source;
};

const seedToLocation = (almanac: Almanac, seed: number): number => {
  let val = seed;
  for (const key of MAP_ORDER) {
    val = getMappedValue(almanac[key] as RangedMap, val);
  }

  return val;
};

const parseInput = (lines: string[]) => {
  const almanac: Almanac = {
    seeds: lines[0]
      .split(":")[1]
      .trim()
      .split(" ")
      .filter((s) => s.length)
      .map((s) => parseInt(s, 10)),
    ["seed-to-soil"]: [],
    ["soil-to-fertilizer"]: [],
    ["fertilizer-to-water"]: [],
    ["water-to-light"]: [],
    ["light-to-temperature"]: [],
    ["temperature-to-humidity"]: [],
    ["humidity-to-location"]: [],
  };

  let currentKey = null;
  for (let i = 2; i < lines.length; i++) {
    if (currentKey == null) {
      if (lines[i].includes("map:")) {
        currentKey = lines[i].split(" ")[0];
      }
    } else if (lines[i].length === 0) {
      currentKey = null;
    } else {
      const [destStart, srcStart, length] = lines[i]
        .split(" ")
        .map((x) => parseInt(x, 10));
      ((almanac as any)[currentKey] as RangedMap).push({
        end: srcStart + length - 1,
        start: srcStart,
        offset: destStart - srcStart,
      });
    }
  }

  return almanac;
};

export const partA: Solver = (lines: string[]) => {
  const almanac = parseInput(lines);
  return Math.min(
    ...almanac.seeds.map((seed) => seedToLocation(almanac, seed))
  );
};

interface IRange {
  start: number;
  end: number;
  empty?: boolean;
}

const EMPTY_RANGE = { start: 0, end: -1, empty: true } as const;

const toRange = (
  range: { start: number } & ({ end: number } | { length: number })
): IRange => {
  if ("length" in range && "end" in range) {
    throw new Error("end and length are exclusive options, use only one");
  }

  let end = "end" in range ? range.end : range.start + range.length - 1;

  if (end < range.start) {
    return EMPTY_RANGE;
  }

  return { start: range.start, end };
};

const intersectionRange = (a: IRange, b: IRange): IRange => {
  if (a.empty || b.empty || a.end < b.start || b.end < a.start) {
    return EMPTY_RANGE;
  }

  return { start: Math.max(a.start, b.start), end: Math.min(a.end, b.end) };
};

const offsetRange = ({ start, end }: IRange, offset: number): IRange => ({
  start: start + offset,
  end: end + offset,
});

const subtractRange = (
  a: IRange,
  b: IRange,
  intersectionCache?: IRange
): IRange[] => {
  const intersection = intersectionCache ?? intersectionRange(a, b);

  if (intersection.empty) {
    return [{ ...a }];
  }
  // else if (a.start < b.start && a.end > b.end) {
  //   return [{ start: a.start, end: intersection.start - 1}, {start: intersection.end + 1, end: a.end}];
  // } else if (a.start > b.start && a.end < b.end) {
  //   return [];
  // } else if (b.start >= a.end) {
  //   return [{start: a.start, end: intersection.start - 1}];
  // } else if (b.end >= a.start) {
  //   return [{start: intersection.end + 1, end: a.end}];
  // }
  return [
    { start: a.start, end: intersection.start - 1 },
    { start: intersection.end + 1, end: a.end },
  ]
    .map(toRange)
    .filter((r) => !r.empty);
  // cases:
  // 1. no overlap, return a
  // 2. a is around b, two ranges are returned from left and right of intersection: a.start to intersection.start - 1, intersection.end + 1 to a.end
  // 3. a is fully surrounded by b, return no ranges
  // 4. b overlaps partially with right of a, return range that is a.start to intersection.start - 1
  // 5. b overlaps partially with left of a, return range that is intersection.end + 1 to a.end
};

const parseSeedRanges = (almanac: Almanac): IRange[] => {
  if (almanac.seeds.length % 2 !== 0) {
    throw new Error("cannot parse as ranges when odd number of seeds");
  }

  const ranges = [] as IRange[];
  for (let i = 0; i < almanac.seeds.length / 2; i++) {
    ranges.push(
      toRange({ start: almanac.seeds[i * 2], length: almanac.seeds[i * 2 + 1] })
    );
  }

  return ranges;
};

export const partB: Solver = (lines: string[]) => {
  const almanac = parseInput(lines);
  let ranges = parseSeedRanges(almanac);

  for (const mapKey of MAP_ORDER) {
    const nextRanges = [] as IRange[];

    for (const inputRange of ranges) {
      const queue = [inputRange];
      while (queue.length) {
        const range = queue.pop()!;

        let foundMapping = false;
        for (const mapping of almanac[mapKey]) {
          const intersection = intersectionRange(range, mapping);
          if (intersection.empty) {
            continue;
          }

          queue.push(...subtractRange(range, intersection));
          nextRanges.push(offsetRange(intersection, mapping.offset));
          foundMapping = true;
          break;
        }

        if (!foundMapping) {
          nextRanges.push(range);
        }
      }
    }
    ranges = nextRanges;
  }

  let min = Number.MAX_SAFE_INTEGER;
  for (const range of ranges) {
    if (range.start < min) {
      min = range.start;
    }
  }

  return min;
};

// slow, brute force approach, took 9.5 minutes on M1 Pro
// export const partB: Solver = (lines: string[]) => {
//   const almanac = parseInput(lines);
//   const ranges = [...almanac.seeds];
//   let min = Number.MAX_SAFE_INTEGER;

//   while (ranges.length >= 2) {
//     const start = ranges.shift()!;
//     const length = ranges.shift()!;
//     console.log(
//       `current min: ${min}, processing seed ${start} to ${
//         start + length - 1
//       } now, ${Math.floor(1 + ranges.length / 2)} ranges left...`
//     );
//     for (let seed = start; seed < start + length; seed++) {
//       const loc = seedToLocation(almanac, seed);
//       if (loc < min) min = loc;
//     }
//   }
//   return min;
// };
