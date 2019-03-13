import {Any} from "river-core";
import {Diff} from "../types";

export const PATH_DELIMITER = ".";

/**
 * Prepends all paths in the specified diff with the specified prefix.
 * @param diff
 * @param prefix
 */
export function prefixDiffPaths<T>(
  diff: Diff<T>, prefix: string
): Diff<{ [key: string]: T[keyof T] }> {
  const diffSet = diff.set;
  const diffDel = diff.del;
  const set = {};
  const del = {};
  for (const key in diffSet) {
    set[prefix + PATH_DELIMITER + key] = diffSet[key];
  }
  for (const key in diffDel) {
    del[prefix + PATH_DELIMITER + key] = diffDel[key];
  }
  return {set, del};
}

/**
 * Extracts root path from the specified path-indexed lookup.
 * @param paths
 */
export function getRootPath(paths: Any): string {
  let keys: Array<string>;
  let root: string;
  for (const path in paths) {
    if (keys) {
      if (!path.startsWith(root)) {
        const split = path.split(PATH_DELIMITER);
        const length = Math.min(keys.length, split.length);
        let i;
        for (i = 0; i < length; i++) {
          if (keys[i] !== split[i]) {
            break;
          }
        }
        keys = keys.splice(0, i);
        root = keys.join(PATH_DELIMITER);
      }
    } else {
      const split = path.split(PATH_DELIMITER);
      split.pop();
      keys = split;
      root = keys.join(PATH_DELIMITER);
    }
  }
  return root;
}

/**
 * Retrieves the specified path component.
 * Not protected from out-of-bounds indexes for performance reasons.
 * @param path
 * @param index
 * @link https://jsperf.com/path-component-extraction
 */
export function getPathComponent(path: string, index: number): string {
  let start = 0;
  let end = path.indexOf(PATH_DELIMITER, start);
  while (index--) {
    start = end + 1;
    end = path.indexOf(PATH_DELIMITER, start);
  }
  if (end === -1) {
    end = path.length;
  }
  return path.substring(start, end);
}

/**
 * Replaces the matching end of the path with the specified string.
 * @param path
 * @param from
 * @param to
 */
export function replacePathTail(path: string, from: string, to: string): string {
  return path.substring(0, path.lastIndexOf(from)) + to;
}
