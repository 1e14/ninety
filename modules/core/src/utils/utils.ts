import {Diff} from "../types";

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
    set[prefix + "." + key] = diffSet[key];
  }
  for (const key in diffDel) {
    del[prefix + "." + key] = diffDel[key];
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
 * Extracts common stem from the specified string pair.
 * @param a
 * @param b
 */
export function getCommonStem(a: string, b?: string): string {
  if (a === b || b === undefined) {
    return a;
  } else {
    const length = Math.min(a.length, b.length);
    let i;
    for (i = 0; i < length; i++) {
      if (a[i] !== b[i]) {
        break;
      }
    }
    return a.substr(0, i);
  }
}
