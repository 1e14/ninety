import {Any} from "river-core";
import {ComponentsByPort, PortsByComponent} from "../types";

export const PATH_DELIMITER = ".";

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

export function countPathComponents(path: string): number {
  let i: number = 0;
  let next: number = -1;
  do {
    next = path.indexOf(PATH_DELIMITER, next + 1);
    i++;
  } while (next > -1);
  return i;
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
    return path.substring(start);
  } else {
    return path.substring(start, end);
  }
}

/**
 * Replaces the specified path component with the result of the specified
 * callback.
 * @param path
 * @param at
 * @param cb
 */
export function replacePathComponent(
  path: string,
  at: number,
  cb: (comp: string) => string
) {
  let start = 0;
  let end = path.indexOf(PATH_DELIMITER, start);
  while (at--) {
    start = end + 1;
    end = path.indexOf(PATH_DELIMITER, start);
  }
  if (end === -1) {
    return path.slice(0, start) + cb(path.slice(start));
  } else {
    return path.slice(0, start) + cb(path.slice(start, end)) + path.slice(end);
  }
}

/**
 * Replaces the specified path component and the rest of the path with the
 * result of the specified callback.
 * @param path
 * @param cb
 * TODO: Rename to replacePathTail once other replacePathTail is removed.
 */
export function replacePathTail(
  path: string,
  cb: (comp: string) => string
): string {
  const pos = path.lastIndexOf(PATH_DELIMITER);
  return path.slice(0, pos + 1) + cb(path.slice(pos + 1));
}

/**
 * TODO: Add tests
 * @param bundles
 */
export function invertPathsByComponent<P extends string>(
  bundles: ComponentsByPort<P>
): PortsByComponent<P> {
  const result = <PortsByComponent<P>>{};
  for (const port in bundles) {
    const bundle = bundles[port];
    for (const path of bundle) {
      const ports = result[path] = result[path] || [];
      ports.push(port);
    }
  }
  return result;
}
