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
 * Applies source diff to target diff.
 * @param source
 * @param target
 */
export function compoundDiff<T>(source: Diff<T>, target: Diff<T>): boolean {
  const targetSet = target.set;
  const targetDel = target.del;
  let changed = false;

  // transferring deletes
  for (const path in source.del) {
    if (path in targetSet) {
      delete targetSet[path];
      changed = true;
    }
    if (!(path in targetDel)) {
      targetDel[path] = null;
      changed = true;
    }
  }

  // transferring sets
  const sourceSet = source.set;
  for (const path in sourceSet) {
    if (path in targetDel) {
      delete targetDel[path];
      changed = true;
    }
    if (targetSet[path] !== sourceSet[path]) {
      targetSet[path] = sourceSet[path];
      changed = true;
    }
  }

  return changed;
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
