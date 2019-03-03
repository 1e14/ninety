import {Diff} from "gravel-core";
import {Any} from "river-core";

const hOP = Object.prototype.hasOwnProperty;

/**
 * Applies diff to the specified object.
 * @param current Current object.
 * @param diff Diff to be applied.
 */
export function mergeObject<T extends Any>(
  current: Partial<T>,
  diff: Diff<T>
): boolean {
  let changed = false;

  current = current || <T>{};

  const set = diff.set;
  if (set) {
    for (const [key, value] of Object.entries(set)) {
      if (value !== current[key]) {
        current[key] = value;
        changed = true;
      }
    }
  }
  const del = diff.del;
  if (del) {
    for (const key in del) {
      if (hOP.call(current, key)) {
        delete current[key];
        changed = true;
      }
    }
  }

  return changed;
}

// TODO: Add mergeArray()
