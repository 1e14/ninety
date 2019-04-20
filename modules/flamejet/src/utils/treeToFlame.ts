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
 */
export function treeToFlame(tree: any): Flame {
  const result = {};
  if (tree instanceof Array) {
    for (let i = 0, length = tree.length; i < length; i++) {
      treeToFlameR(tree[i], String(i), result);
    }
  } else if (tree instanceof Object) {
    const keys = Object.keys(tree);
    for (let i = 0, length = keys.length; i < length; i++) {
      const key = keys[i];
      treeToFlameR(tree[key], key, result);
    }
  }
  return result;
}
