import { program } from "commander";
import { cpSync, existsSync } from "node:fs";
import { asComment, updateFileWithReplace } from "./util";
import { fetchDay } from "./api";

program
  .option("--force", "overwrite any existing directory")
  .argument("<day-num>", "day number");

program.parse();

const opts = program.opts();
const args = program.args;

const dayNum = parseInt(args[0]);
if (isNaN(dayNum)) {
  console.error("day-num must be a number");
  process.exit(1);
}

// load question and input from API
const data = await fetchDay(2023, dayNum);

const packagePath = `../days/${dayNum}`;
if (existsSync(packagePath) && !opts.force) {
  console.error("directory already exists (use --force)");
  process.exit(1);
}

cpSync("./template/", packagePath, { recursive: true });

await updateFileWithReplace(`../days/${dayNum}/package.json`, {
  ["<DAY_NUM>"]: `${dayNum}`,
  ["<PREV_DAY_NUM>"]: `${dayNum - 1}`,
});
await updateFileWithReplace(`../days/${dayNum}/input.txt`, {
  ["<DAY_INPUT>"]: data.input,
});
await updateFileWithReplace(`../days/${dayNum}/src/solve.ts`, {
  ["<DAY_DESCRIPTION>"]: asComment(data.question),
});
