import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function extractRaces(contents) {
  const lines = contents.split("\n");
  const times = lines[0].split(/^Time:\s+/)[1].split(/\s+/);
  const distances = lines[1].split(/^Distance:\s+/)[1].split(/\s+/);

  return times.map((t, i) => [+t, +distances[i]]);
}

async function main() {
  const contents = readFileSync(resolve("./day-6/data.txt"), "utf-8");
  const races = extractRaces(contents);
  let result = 1;

  for (let i = 0; i < races.length; i++) {
    const [time, record] = races[i];
    let beat = 0;

    for (let j = 1; j <= time; j++) {
      if ((time - j) * j > record) {
        beat++;
      }
    }

    if (beat > 0) {
      result *= beat;
    }
  }

  return result;
}

main().then((res) => console.log(res));
