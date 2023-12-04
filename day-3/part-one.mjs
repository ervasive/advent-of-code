import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * @typedef {{type: 'symbol'} | {type: 'number', value: number}} Token
 * @typedef {{tokens: string}} Line
 *
 * @param {string} val
 * @returns {Map<number, Token>} result
 */
function getTokenizedMap(val) {
  const map = new Map();
  let pos = 0;
  let num = "";

  for (let i = 0; i < val.length; i++) {
    if (val[i] === "\n") {
      continue;
    }

    if (!isNaN(val[i])) {
      num += val[i];

      if (i + 1 === val.length) {
        map.set(pos - num.length, { type: "number", value: +num });
      }

      pos++;
      continue;
    }

    if (num) {
      map.set(pos - num.length, { type: "number", value: +num });
      num = "";
    }

    if (val[i] !== ".") {
      map.set(pos, { type: "symbol" });
    }

    pos++;
  }

  return map;
}

async function main() {
  const contents = readFileSync(resolve("./day-3/data.txt"), "utf-8");
  const lineLength = contents.indexOf("\n");
  const m = getTokenizedMap(contents);

  let sum = 0;

  for (let [pos, item] of m) {
    if (item.type === "number") {
      const length = item.value.toString().length + 2;
      const positionsToCheck = Array.from({ length }, (_, i) => pos + i - 1);

      for (let i of positionsToCheck) {
        let isSymbol =
          m.get(i)?.type === "symbol" ||
          m.get(i - lineLength)?.type === "symbol" ||
          m.get(i + lineLength)?.type === "symbol";

        if (isSymbol && !item.isAdded) {
          sum += item.value;
          item.isAdded = true;
        }
      }
    }
  }

  return sum;
}

main().then((res) => console.log(res));
