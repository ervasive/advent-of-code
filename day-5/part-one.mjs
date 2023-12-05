import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import readline from "readline/promises";

async function main() {
  const stream = createReadStream(resolve("./day-5/data.txt"));
  const lines = readline.createInterface({ input: stream });
  let min = Infinity;

  /** @type {number[]} */
  let seeds;

  /** @type {Map<{min: number, max: number}, number>[]} */
  const pipeline = [];

  // parse input file, build seeds and pipeline structure
  for await (let line of lines) {
    if (!line.length) continue;

    if (isNaN(line[0])) {
      if (line.substring(0, 6) === "seeds:") {
        seeds = line.split(": ")[1].split(/\s+/g).map(Number);
      } else {
        pipeline[pipeline.length] = new Map();
      }
    } else {
      const parts = line.split(/\s+/);
      const min = +parts[1];
      const max = +parts[1] + +parts[2];
      const offset = -(+parts[1] - +parts[0]);

      pipeline[pipeline.length - 1].set({ min, max }, offset);
    }
  }

  if (!seeds) {
    throw new Error("Could not extract seeds");
  }

  if (!pipeline.length) {
    throw new Error("Could not extract meaningful mappings");
  }

  seeds.forEach((s) => {
    let translated = s;

    pipeline.forEach((category) => {
      let offset = 0;

      for (let [{ min, max }, v] of category.entries()) {
        if (offset) break;

        if (translated >= min && translated < max) {
          offset = v;
        }
      }

      translated = translated + offset;
    });

    if (translated < min) {
      min = translated;
    }
  });

  return min;
}

main().then((res) => console.log(res));
