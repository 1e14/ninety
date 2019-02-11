import {IDiff, TJson} from "../utils";

/**
 * Applies diff to the specified object.
 * @param current Current object.
 * @param diff Diff to be applied.
 */
export function mergeObject<T extends TJson>(
  current: Partial<T>,
  diff: IDiff<T>
): void {
  current = current || <T>{};

  const set = diff.set;
  if (set) {
    for (const [key, value] of set) {
      current[key] = value;
    }
  }
  const del = diff.del;
  if (del) {
    for (const key of del) {
      delete current[key];
    }
  }
}

// TODO: Add mergeArray()
