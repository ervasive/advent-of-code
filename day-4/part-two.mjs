import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import readline from "readline/promises";

async function main() {
  const stream = createReadStream(resolve("./day-4/data.txt"));
  const lines = readline.createInterface({ input: stream });
  const cards = new Map();
  let currCard = 1;

  for await (let line of lines) {
    const parts = line.split(" | ");
    const [_, __, ...winning] = parts[0].split(/\s+/g);
    const present = parts[1].split(/\s+/g);

    cards.set(currCard, (cards.get(currCard) || 0) + 1);

    for (let i = 0; i < cards.get(currCard); i++) {
      const found = winning.filter((c) => present.includes(c));

      for (let j = 1; j <= found.length; j++) {
        cards.set(
          currCard + j,
          cards.get(currCard + j) ? cards.get(currCard + j) + 1 : 1
        );
      }
    }

    currCard++;
  }

  return [...cards.values()].reduce((acc, el) => acc + el, 0);
}

main().then((res) => console.log(res));
