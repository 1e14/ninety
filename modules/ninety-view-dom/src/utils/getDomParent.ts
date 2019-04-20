import {countPathComponents, getPathComponent} from "flamejet";
import {PATH_TAG_DELIMITER} from "./fetchDomParent";

/**
 * Retrieves parent DOM property for the specified DOM path.
 * @param stack Cached parent DOM properties along the path.
 * @param path Path to fetch parent property for.
 */
export function getDomParent(stack: Array<any>, path: string): any {
  const parentStackSize = stack.length - 1;
  const parentDepth = countPathComponents(path) - 1;
  let property = stack[parentStackSize];
  for (let i = parentStackSize; i < parentDepth; i++) {
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
