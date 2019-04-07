import {FlameDiff} from "../types";

/**
 * Normalizes paths in a FlameDiff by replacing commas with dots.
 * @param value
 */
export function normalizePaths(value: FlameDiff): FlameDiff {
  const set = {};
  const del = {};
  const viewSet = value.set;
  const viewDel = value.del;
  for (const path in viewSet) {
    set[path.replace(/,/g, ".")] = viewSet[path];
  }
  for (const path in viewDel) {
    del[path.replace(/,/g, ".")] = null;
  }
  return {set, del};
}
