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
