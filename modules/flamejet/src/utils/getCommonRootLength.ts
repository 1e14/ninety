import {PATH_DELIMITER} from "./PATH_DELIMITER";

export function getCommonRootLength(next: string, curr: string): number {
  let pos = 0;
  let i = 0;
  const length = next.length;
  // we're parsing next until we bump into a difference
  // or reach the end of next
  while (next[i] === curr[i] && i < length) {
    if (next[i] === PATH_DELIMITER) {
      pos++;
    }
    i++;
  }
  if (i >= curr.length) {
    // next contains curr, returning length of curr
    return pos + 1;
  } else {
    // returning index of parent path
    return pos;
  }
}
