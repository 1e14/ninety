import {Flame, FlameTraversalCallback} from "../types";
import {getCommonRootLength} from "./getCommonRootLength";

/**
 * Traverses a flame and invokes a callback on each iteration.
 * @param flame Flame to be traversed.
 * @param cb Function to be invoked on each path/value pair.
 */
export function traverseFlame(
  flame: Flame,
  cb: FlameTraversalCallback
): void {
  /** Last path */
  let last: string = "";

  // going in order of paths makes traversal smoother and makes sure any
  // subtree operations are done before affected leaf nodes
  const paths = Object.keys(flame).sort();
  const count = paths.length;
  for (let i = 0; i < count; i++) {
    const path = paths[i];
    const value = flame[path];
    const commonPathLength = getCommonRootLength(path, last);
    cb(path, value, commonPathLength);
    last = path;
  }
}
