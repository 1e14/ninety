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
  {set, del}: Diff<T>
): boolean {
  let changed = false;

  current = current || <T>{};

  for (const key in set) {
    const value = set[key];
    if (value !== current[key]) {
      current[key] = value;
      changed = true;
    }
  }
  for (const key in del) {
    if (hOP.call(current, key)) {
      delete current[key];
      changed = true;
    }
  }

  return changed;
}

// TODO: Add mergeArray()
