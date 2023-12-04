import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import readline from "readline/promises";

async function main() {
  const stream = createReadStream(resolve("./day-4/data.txt"));
  const lines = readline.createInterface({ input: stream });
  let sum = 0;

  for await (let line of lines) {
    const parts = line.split(" | ");
    const [_, __, ...winning] = parts[0].split(/\s+/g);
    const present = parts[1].split(/\s+/g);
    let points = 0;

    for (let i of winning) {
      if (present.includes(i)) {
        points = points > 0 ? points * 2 : 1;
      }
    }

    sum += points;
  }

  return sum;
}

main().then((res) => console.log(res));
