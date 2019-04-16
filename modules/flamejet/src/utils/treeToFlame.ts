import {Flame} from "../types";
import {PATH_DELIMITER} from "./PATH_DELIMITER";

function treeToFlameR(node: any, path: string, result: Flame): void {
  if (node instanceof Array) {
    for (let i = 0, length = node.length; i < length; i++) {
      treeToFlameR(node[i], path + PATH_DELIMITER + i, result);
    }
  } else if (node instanceof Object) {
    const keys = Object.keys(node);
    for (let i = 0, length = keys.length; i < length; i++) {
      const key = keys[i];
      treeToFlameR(node[key], path + PATH_DELIMITER + key, result);
    }
  } else {
    result[path] = node;
  }
}

/**
 * Flattens tree and returns the flattened tree as a flame. The tree can't
 * be circular.
 * @param tree Tree data.
 * @param root Path to the tree relative to its parent.
 */
export function treeToFlame(tree: any, root: string): Flame {
  const result = {};
  treeToFlameR(tree, root, result);
  return result;
}
