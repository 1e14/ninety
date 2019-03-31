import {countPathComponents, getPathComponent} from "../../flame/utils";
import {PATH_TAG_DELIMITER} from "./fetchDomParent";

/**
 * Retrieves parent DOM property for the specified DOM path, starting at
 * the specified position in the path.
 * @param stack
 * @param path Path to fetch parent property for.
 */
export function getDomParent2(stack: Array<any>, path: string): any {
  const stackSize = stack.length;
  const parentDepth = countPathComponents(path) - 1;
  let property = stack[stackSize - 1];

  for (let i = stackSize; i < parentDepth; i++) {
    const component = getPathComponent(path, i);
    if (property instanceof Node) {
      property = property[component];
    } else if (property instanceof NodeList) {
      const [index] = component.split(PATH_TAG_DELIMITER);
      const next = property[index];
      if (!next) {
        // path ends here
        return undefined;
      } else {
        property = next;
      }
    } else {
      // we're only concerned with nodes and node lists
      return undefined;
    }
    stack.push(property);
  }

  return property;
}
