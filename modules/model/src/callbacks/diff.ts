import {Diff, DiffDel, DiffSet} from "gravel-core";
import {Any} from "river-core";

/**
 * Extracts difference of the two specified objects.
 * @param before "Before" object.
 * @param after "After" object.
 */
export function diffObjects<T extends Any>(
  before: Partial<T>,
  after: Partial<T>
): Diff<T> | false {
  let different = false;

  // extracting key-value pairs to be updated
  let set: DiffSet<T>;
  if (before) {
    set = <DiffSet<T>>{};
    for (const key in after) {
      const value = after[key];
      if (value !== before[key]) {
        set[key] = value;
        different = true;
      }
    }
  } else {
    set = <DiffSet<T>>after;
    different = true;
  }

  // extracting keys to be deleted
  let del: DiffDel<T>;
  if (after) {
    del = <DiffDel<T>>{};
    for (const key in before) {
      const value = before[key];
      if (value !== undefined && after[key] === undefined) {
        del[key] = null;
        different = true;
      }
    }
  } else {
    del = <DiffDel<T>>before;
    different = true;
  }

  return different && {set, del};
}

// TODO: Add diffArrays()
