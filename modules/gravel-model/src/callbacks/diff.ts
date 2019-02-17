import {Any} from "@protoboard/river";
import {Diff, DiffDel, DiffSet} from "../types";

/**
 * Extracts difference of the two specified objects.
 * @param before "Before" object.
 * @param after "After" object.
 */
export function diffObjects<T extends Any>(
  before: Partial<T>,
  after: Partial<T>
): Diff<T> {
  // extracting key-value pairs to be updated
  let set: DiffSet<T>;
  if (before) {
    set = [];
    for (const [key, value] of Object.entries(after)) {
      if (value !== before[key]) {
        set.push([<keyof T>key, value]);
      }
    }
  } else {
    set = <Array<[keyof T, T[keyof T]]>>Object.entries(after);
  }

  // extracting keys to be deleted
  let del: DiffDel<T>;
  if (after) {
    del = [];
    for (const [key, value] of Object.entries(before)) {
      if (value !== undefined && after[key] === undefined) {
        del.push(<keyof T>key);
      }
    }
  } else {
    del = <DiffDel<T>>Object.keys(before);
  }

  return {set, del};
}

// TODO: Add diffArrays()
