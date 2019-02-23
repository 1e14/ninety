import {Diff} from "gravel-types";
import {Any} from "river-core";

const hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Applies diff to the specified object.
 * @param current Current object.
 * @param diff Diff to be applied.
 */
export function mergeObject<T extends Any>(
  current: Partial<T>,
  diff: Diff<T>
): boolean {
  let merged = false;

  current = current || <T>{};

  const set = diff.set;
  if (set) {
    for (const [key, value] of Object.entries(set)) {
      if (value !== current[key]) {
        current[key] = value;
        merged = true;
      }
    }
  }
  const del = diff.del;
  if (del) {
    for (const key in del) {
      if (current[key] !== undefined) {
        current[key] = undefined;
        merged = true;
      }
    }
  }

  return merged;
}

// TODO: Add mergeArray()
