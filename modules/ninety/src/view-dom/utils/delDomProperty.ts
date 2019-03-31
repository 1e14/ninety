import {PATH_DELIMITER} from "../../flame/utils";
import {ContextualNodeListOf} from "../types";
import {getDomParent} from "./getDomParent";

export function delDomProperty(
  stack: Array<any>,
  path: string
): boolean {
  const parent = getDomParent(stack, path);
  const key = path.slice(path.lastIndexOf(PATH_DELIMITER) + 1);
  if (parent instanceof Node) {
    // node property
    parent[key] = null;
    return true;
  } else if (parent instanceof NodeList) {
    // extracting child index from path component
    const [index] = key.split(":");
    const child = parent[index];
    if (child) {
      // replacing child w/ placeholder
      const comment = document.createComment("");
      const parentNode = (<ContextualNodeListOf<ChildNode>>parent).context;
      parentNode.replaceChild(comment, child);
    }
    return true;
  } else if (parent instanceof NamedNodeMap) {
    // attributes
    parent.removeNamedItem(key);
    return true;
  } else if (parent instanceof DOMTokenList) {
    // CSS classes
    parent.remove(key);
    return true;
  } else if (parent instanceof CSSStyleDeclaration) {
    // CSS styles
    parent[key] = null;
    return true;
  } else {
    return !parent;
  }
}
