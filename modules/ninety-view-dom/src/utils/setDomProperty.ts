import {PATH_DELIMITER} from "flamejet";
import {fetchDomParent} from "./fetchDomParent";

/**
 * Sets single property in the DOM.
 * @param stack Cached parent DOM properties along the path.
 * @param path Path to DOM property.
 * @param value Property value to be set.
 */
export function setDomProperty(
  stack: Array<any>,
  path: string,
  value: any
): boolean {
  const parent = fetchDomParent(stack, path);
  const key = path.slice(path.lastIndexOf(PATH_DELIMITER) + 1);
  if (parent instanceof Node) {
    parent[key] = value;
    return true;
  } else if (parent instanceof NamedNodeMap) {
    // attributes
    let attribute = parent.getNamedItem(key);
    if (!attribute) {
      attribute = document.createAttribute(key);
      parent.setNamedItem(attribute);
    }
    attribute.value = value;
    return true;
  } else if (parent instanceof DOMTokenList) {
    // CSS classes
    parent.add(key, key);
    return true;
  } else if (parent instanceof CSSStyleDeclaration) {
    // CSS styles
    parent[key] = value;
    return true;
  } else {
    // unrecognized property parent
    return false;
  }
}
