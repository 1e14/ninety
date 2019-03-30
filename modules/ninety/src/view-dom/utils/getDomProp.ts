import {Flame} from "../../flame/types";
import {PATH_DELIMITER} from "../../flame/utils";
import {getDomParent} from "./getDomParent";

export function getDomProp(
  cache: Flame,
  path: string,
  from: number = 0
): any {
  const parent = getDomParent(cache, path, from);
  const key = path.slice(path.lastIndexOf(PATH_DELIMITER) + 1);
  if (parent instanceof Node) {
    return parent[key];
  } else if (parent instanceof NodeList) {
    const [index] = key.split(":");
    return parent[index];
  } else if (parent instanceof NamedNodeMap) {
    // attributes
    const attribute = parent.getNamedItem(key);
    return attribute && attribute.value;
  } else if (parent instanceof DOMTokenList) {
    // CSS classes
    return parent.contains(key);
  } else if (parent) {
    // CSS styles
    // and everything else
    return parent[key];
  } else {
    // unrecognized parent property
    return undefined;
  }
}
