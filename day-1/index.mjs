import { createReadStream } from "node:fs";
import { resolve } from "node:path";
import readline from "readline/promises";

const mappings = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function getNumericValue(pos, source) {
  if (isFinite(source[pos])) {
    return +source[pos];
  } else {
    for (let [k, v] of Object.entries(mappings)) {
      if (source.startsWith(k, pos)) {
        return v;
      }
    }
  }
}

/**
 *
 * @param {string} val
 */
function getLineSum(val) {
  let first;
  let last;

  for (let i = 0; i < val.length; i++) {
    if (first) break;
    first = getNumericValue(i, val);
  }

  for (let i = val.length - 1; i >= 0; i--) {
    if (last) break;
    last = getNumericValue(i, val);
  }

  if (!first && !last) {
    return 0;
  }

  return Number("" + (first || last) + (last || first));
}

async function main() {
  const stream = createReadStream(resolve("./day-1/data.txt"));
  const lines = readline.createInterface({ input: stream });
  let sum = 0;

  for await (let line of lines) {
    sum += getLineSum(line);
  }

  return sum;
}

main().then((res) => console.log(res));
