import {Flame} from "../../flame/types";
import {PATH_DELIMITER} from "../../flame/utils";
import {getDomParent} from "./getDomParent";

/**
 * Sets single property in the DOM.
 * @param cache Lookup of DOM properties by path.
 * @param path Path to DOM property.
 * @param value Property value to be set.
 * @param from Starting position in path.
 */
export function setDomProp(
  cache: Flame,
  path: string,
  value: any,
  from: number = 0
): boolean {
  const parent = getDomParent(cache, path, from);
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
