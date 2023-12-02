import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import readline from "readline/promises";

const colors = {
  red: 12,
  green: 13,
  blue: 14,
};

/**
 *
 * @param {string} val
 * @returns
 */
function processLine(val) {
  const parts = val.match(/^Game\s(\d+):(.*)$/);
  const id = parseInt(parts[1]);

  for (let set of parts[2].split(";")) {
    for (let item of set.split(",")) {
      const trimmed = item.trim();

      for (let [color, max] of Object.entries(colors)) {
        if (trimmed.endsWith(color)) {
          if (trimmed.split(" ")[0] > max) {
            return undefined;
          }
        }
      }
    }
  }

  return id;
}

async function main() {
  const stream = createReadStream(resolve("./day-2/data.txt"));
  const lines = readline.createInterface({ input: stream });
  let sum = 0;

  for await (let line of lines) {
    const id = processLine(line);

    if (id) {
      sum += parseInt(id);
    }
  }

  return sum;
}

main().then((res) => console.log(res));
