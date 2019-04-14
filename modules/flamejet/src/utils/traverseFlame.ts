import {Flame, FlameTraversalCallback} from "../types";
import {countCommonComponents} from "./countCommonComponents";

/**
 * Traverses a flame and invokes a callback on each iteration.
 * @param flame Flame to be traversed.
 * @param cb Function to be invoked on each path/value pair.
 * @param root Root path.
 */
export function traverseFlame(
  flame: Flame,
  cb: FlameTraversalCallback,
  root: string
): void {
  let last: string = root;
  for (const path in flame) {
    const value = flame[path];
    const start = countCommonComponents(path, last);
    cb(path, value, start);
    last = path;
  }
}
