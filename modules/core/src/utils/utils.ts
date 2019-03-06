import {Diff} from "../types";

/**
 * Prepends all paths in the specified diff with the specified prefix.
 * @param diff
 * @param prefix
 */
export function prefixDiffPaths<T>(
  diff: Diff<T>, prefix: string
): Diff<{ [key: string]: T[keyof T] }> {
  const result: Diff<T> = {};
  const diffSet = diff.set;
  if (diffSet) {
    const set = result.set = {};
    for (const key in diff.set) {
      set[prefix + "." + key] = diff.set[key];
    }
  }
  const diffDel = diff.del;
  if (diffDel) {
    const del = result.del = {};
    for (const key in diff.del) {
      del[prefix + "." + key] = diff.del[key];
    }
  }
  return result;
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
