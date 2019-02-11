import {IDiff, TDiffDel, TDiffSet, TJson} from "../utils";

/**
 * Extracts difference of the two specified objects.
 * @param before "Before" object.
 * @param after "After" object.
 */
export function diffObjects<T extends TJson>(
  before: Partial<T>,
  after: Partial<T>
): IDiff<T> {
  // extracting key-value pairs to be updated
  let set: TDiffSet<T>;
  if (before) {
    set = {};
    for (const [key, value] of Object.entries(after)) {
      if (value !== before[key]) {
        set[key] = value;
      }
    }
  } else {
    set = after;
  }

  // extracting keys to be deleted
  let del: TDiffDel<T>;
  if (after) {
    del = [];
    for (const [key, value] of Object.entries(before)) {
      if (value !== undefined && after[key] === undefined) {
        del.push(<keyof T>key);
      }
    }
  } else {
    del = <TDiffDel<T>>Object.keys(before);
  }

  return {set, del};
}

// TODO: Add diffArrays()
