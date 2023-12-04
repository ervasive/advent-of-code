import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Extract complete number starting on a position in string
 *
 * @param {number} start
 * @param {string} contents
 *
 * @returns {{value: number, start: number, length: number} | undefined} Extracted number value and required metadata
 */
function extractNumberData(start, contents) {
  if (!isNaN(contents[start])) {
    let offsetNegative = "";
    let offsetPositive = "";

    // go back until non numeric symbol is encountered
    while (true) {
      let offset = start - (offsetNegative.length + 1);

      if (!isNaN(contents[offset])) {
        offsetNegative = contents[offset] + offsetNegative;
      } else {
        break;
      }
    }

    // go forward until non numeric symbol is encountered
    while (true) {
      let offset = start + (offsetPositive.length + 1);

      if (!isNaN(contents[offset])) {
        offsetPositive = offsetPositive + contents[offset];
      } else {
        const value = offsetNegative + contents[start] + offsetPositive;
        return {
          value: Number(value),
          start: start - offsetNegative.length,
          length: value.length,
        };
      }
    }
  }
}

/**
 * Find numeric values around provided position
 *
 * @param {number} position
 * @param {string} contents
 * @param {number} lineLength
 *
 * @returns {number[]} Array of found numbers around provided position
 */
function getNumsAroundPosition(position, contents, lineLength) {
  const found = [];

  // search on previous line
  let prevLineStart = position - 1 - lineLength;

  while (prevLineStart < position + 2 - lineLength) {
    let result = extractNumberData(prevLineStart, contents);

    if (result) {
      found.push(result.value);
      prevLineStart = result.start + result.length;
    } else {
      prevLineStart++;
    }
  }

  // search same line before position
  let before = extractNumberData(position - 1, contents);

  if (before) {
    found.push(before.value);
  }

  // search same line after position
  let after = extractNumberData(position + 1, contents);

  if (after) {
    found.push(after.value);
  }

  // search on next line
  let nextLineStart = position - 1 + lineLength;

  while (nextLineStart < position + 2 + lineLength) {
    let result = extractNumberData(nextLineStart, contents);

    if (result) {
      found.push(result.value);
      nextLineStart = result.start + result.length;
    } else {
      nextLineStart++;
    }
  }

  return found;
}

async function main() {
  const contents = readFileSync(resolve("./day-3/data.txt"), "utf-8");
  const lineLength = contents.indexOf("\n");
  const withoutNL = contents.replace(/\n/g, "");
  const items = withoutNL.matchAll(/\*/g);

  let sum = 0;

  for (let { index } of items) {
    const found = getNumsAroundPosition(index, withoutNL, lineLength);

    if (found.length === 2) {
      sum += found[0] * found[1];
    }
  }

  return sum;
}

main().then((res) => console.log(res));
