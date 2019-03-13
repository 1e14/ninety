import {Diff} from "../types";

/**
 * Applies diff to hash.
 * @param diff
 * @param target
 */
export function applyDiff<T>(diff: Diff<T>, target: Partial<T>): boolean {
  let changed = false;

  // applying deletes
  for (const path in diff.del) {
    if (path in target) {
      delete target[path];
      changed = true;
    }
  }

  // applying sets
  const sourceSet = diff.set;
  for (const path in sourceSet) {
    if (target[path] !== sourceSet[path]) {
      target[path] = sourceSet[path];
      changed = true;
    }
  }

  return changed;
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
