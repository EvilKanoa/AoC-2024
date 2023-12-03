import { sessionCookie } from "../../config.json";
import { keysInParallel } from "./util";
import TurndownService from "turndown";
import { load } from "cheerio";

export interface AdventOfCodeDay {
  input: string;
  question: { p1: string; p2: string };
  // TODO: Try to extract these values to autogenerate test cases
  // example: string;
  // exampleOutput: number;
}

const service = new TurndownService();

export const fetchDay = async (
  year: number,
  day: number
): Promise<AdventOfCodeDay> => {
  const input = fetch(`https://adventofcode.com/${year}/day/${day}/input`, {
    method: "GET",
    headers: { Cookie: `session=${sessionCookie}` },
  }).then((r) => {
    if (!r.ok) {
      throw new Error("Failed to fetch input!", {
        cause: `${r.status} ${r.statusText}`,
      });
    }

    return r.text();
  });

  const question = fetch(`https://adventofcode.com/${year}/day/${day}`, {
    method: "GET",
    headers: { Cookie: `session=${sessionCookie}` },
  })
    .then((r) => {
      if (!r.ok) {
        throw new Error("Failed to question input!", {
          cause: `${r.status} ${r.statusText}`,
        });
      }

      return r.text();
    })
    .then((html) => {
      const $ = load(html);
      const parts = [] as string[];
      $("body > main > article.day-desc").each((_, el) => {
        parts.push($(el).html() ?? "");
      });
      return {
        p1: service.turndown(parts?.[0] ?? ""),
        p2: service.turndown(parts?.[1] ?? []),
      };
    });

  return await keysInParallel({
    input,
    question,
  });
};
