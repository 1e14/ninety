import {Flame} from "../types";

/**
 * Normalizes paths in a Flame by replacing commas with dots.
 * @param value
 */
export function normalizePaths(value: Flame): Flame {
  const flame = {};
  for (const path in value) {
    flame[path.replace(/,/g, ".")] = value[path];
  }
  return flame;
}
