import {Diff} from "../types";

export const PATH_DELIMITER = ".";

/**
 * Prepends all paths in the specified diff with the specified prefix.
 * @param diff
 * @param prefix
 */
export function prefixDiffPaths<T>(
  diff: Diff<T>, prefix: string
): Diff<{ [key: string]: T[keyof T] }> {
  const diffSet = diff.set;
  const diffDel = diff.del;
  const set = {};
  const del = {};
  for (const key in diffSet) {
    set[prefix + PATH_DELIMITER + key] = diffSet[key];
  }
  for (const key in diffDel) {
    del[prefix + PATH_DELIMITER + key] = diffDel[key];
  }
  return {set, del};
}

/**
 * Extracts root path from the specified string pair.
 * @param a
 * @param b
 */
export function getRootPath(a: string, b?: string): string {
  const tmpA = a.split(PATH_DELIMITER);
  if (a === b || b === undefined) {
    tmpA.pop();
    return tmpA.join(PATH_DELIMITER);
  } else {
    const length = Math.min(a.length, b.length);
    const tmpB = b.split(PATH_DELIMITER);
    let i;
    for (i = 0; i < length; i++) {
      if (tmpA[i] !== tmpB[i]) {
        break;
      }
    }
    return tmpA.slice(0, i).join(PATH_DELIMITER);
  }
}
