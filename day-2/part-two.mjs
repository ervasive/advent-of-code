import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import readline from "readline/promises";

/**
 *
 * @param {string} val
 * @returns
 */
function processLine(val) {
  const parts = val.match(/^Game\s(\d+):(.*)$/);
  const colors = {
    red: 1,
    green: 1,
    blue: 1,
  };

  for (let set of parts[2].split(";")) {
    for (let item of set.split(",")) {
      const trimmed = item.trim();

      for (let color of Object.keys(colors)) {
        if (trimmed.endsWith(color)) {
          const v = trimmed.split(" ")[0];

          if (v > colors[color]) {
            colors[color] = parseInt(v);
          }
        }
      }
    }
  }

  return colors.red * colors.green * colors.blue;
}

async function main() {
  const stream = createReadStream(resolve("./day-2/data.txt"));
  const lines = readline.createInterface({ input: stream });
  let sum = 0;

  for await (let line of lines) {
    sum += processLine(line);
  }

  return sum;
}

main().then((res) => console.log(res));
