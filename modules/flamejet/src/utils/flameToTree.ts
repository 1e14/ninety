import {Flame} from "../types";
import {countPathComponents} from "./countPathComponents";
import {getPathComponent} from "./getPathComponent";
import {PATH_DELIMITER} from "./PATH_DELIMITER";
import {traverseFlame} from "./traverseFlame";

function fetchTreeParent(stack, path) {
  const parentStackSize = stack.length - 1;
  const parentDepth = countPathComponents(path) - 1;
  let property = stack[parentStackSize];
  for (let i = parentStackSize; i < parentDepth; i++) {
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
  const key = path.slice(path.lastIndexOf(PATH_DELIMITER) + 1);
  parent[key] = value;
}

/**
 * Inflates flame and returns the inflated flame as a tree.
 * @param flame
 */
export function flameToTree(flame: Flame): any {
  const result = {};
  const stack = [result];
  traverseFlame(flame, (path, value, commonPathLength) => {
    // stack is one item longer than path b/c of root
    const maxStackLength = commonPathLength + 1;
    if (stack.length > maxStackLength) {
      stack.length = maxStackLength;
    }
    setTreeProperty(stack, path, value);
  });
  return result;
}
