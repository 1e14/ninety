import {Diff} from "../types";

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
