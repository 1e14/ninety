import {Flame} from "../types";
import {countPathComponents} from "./countPathComponents";
import {getPathComponent} from "./getPathComponent";
import {PATH_DELIMITER} from "./PATH_DELIMITER";
import {traverseFlame} from "./traverseFlame";

function fetchTreeParent(stack, path) {
  const stackSize = stack.length;
  const parentDepth = countPathComponents(path) - 1;
  let property = stack[stackSize - 1];
  for (let i = stackSize; i < parentDepth; i++) {
    const component = getPathComponent(path, i);
    const parent = property;
    property = property[component];
    if (!(property instanceof Object)) {
      property = {};
      parent[component] = property;
    }
    stack.push(property);
  }
  return property;
}

function setTreeProperty(
  stack: Array<any>,
  path: string,
  value: any
): void {
  const parent = fetchTreeParent(stack, path);
  // console.log("parent", path, parent);
  const key = path.slice(path.lastIndexOf(PATH_DELIMITER) + 1);
  parent[key] = value;
}

/**
 * Inflates flame and returns the inflated flame as a tree.
 * @param flame
 * @param root
 */
export function flameToTree(flame: Flame, root: string): any {
  const result = {};
  const stack = [result];
  traverseFlame(flame, (path, value, start) => {
    if (stack.length > start) {
      // trimming stack back to common root
      stack.length = start;
    }
    setTreeProperty(stack, path, value);
  }, root);
  return result;
}
