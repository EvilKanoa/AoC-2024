import { file } from "bun";
import { program } from "commander";
import { cpSync, existsSync } from "node:fs";

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

const packagePath = `../days/${dayNum}`;
if (existsSync(packagePath) && !opts.force) {
  console.error("directory already exists (use --force)");
  process.exit(1);
}

cpSync("./template/", packagePath, { recursive: true });

let packageJson = await file(`../days/${dayNum}/package.json`).text();
packageJson = packageJson
  .replace("<DAY_NUM>", `${dayNum}`)
  .replace("<PREV_DAY_NUM>", `${dayNum - 1}`);

const writer = file(`../days/${dayNum}/package.json`).writer();
writer.write(packageJson);
await writer.end();
