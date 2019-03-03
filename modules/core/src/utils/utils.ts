import {Diff} from "../types";

/**
 * Prepends all paths in the specified diff with the specified prefix.
 * @param diff
 * @param prefix
 */
export function prefixDiffPaths<T>(
  diff: Diff<T>, prefix: string
): Diff<{ [key: string]: T[keyof T] }> {
  const del = {};
  const set = {};
  for (const key in diff.set) {
    set[prefix + "." + key] = diff.set[key];
  }
  for (const key in diff.del) {
    del[prefix + "." + key] = diff.del[key];
  }
  return {set, del};
}
