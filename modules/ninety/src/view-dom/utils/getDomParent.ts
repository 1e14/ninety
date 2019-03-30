import {Flame} from "../../flame/types";
import {PATH_DELIMITER} from "../../flame/utils";
import {ContextualNodeListOf} from "../types";

export const DEFAULT_TAG_NAME = "div";
export const PATH_TAG_DELIMITER = ":";

/**
 * Adds placeholder comment nodes to the specified parent node up to the
 * (but not including) the specified index.
 * @param node DOM node in which to add placeholders
 * @param index Index up to which to create placeholder nodes.
 */
function addPlaceholders(node: Node, index: number): void {
  for (let i = node.childNodes.length; i < index; i++) {
    const placeholder = document.createComment("");
    node.appendChild(placeholder);
  }
}

/**
 * Retrieves parent DOM property for the specified DOM path, starting at
 * the specified position in the path.
 * @param cache Lookup of DOM properties by path.
 * @param path Path to fetch parent property for.
 * @param from Starting position in path.
 */
export function getDomParent(cache: Flame, path: string, from: number = 0): any {
  let next: any;
  for (
    let to = path.indexOf(PATH_DELIMITER, from);
    to > -1;
    from = to + 1, to = path.indexOf(PATH_DELIMITER, from)
  ) {
    const root = path.slice(0, from);
    const component = path.slice(from, to);
    const property = cache[root];

    if (property instanceof Node) {
      // adding context to node list if necessary
      const childNodes = <ContextualNodeListOf<ChildNode>>property.childNodes;
      if (!childNodes.context) {
        childNodes.context = property;
      }
      next = property[component];
    } else if (property instanceof NodeList) {
      const [index, tag = DEFAULT_TAG_NAME] = component.split(PATH_TAG_DELIMITER);
      next = property[index];
      // adding/replacing DOM element when necessary
      // TODO: add case for node w/ different tag
      if (!next) {
        // adding node
        const parentNode = (<ContextualNodeListOf<ChildNode>>property).context;
        addPlaceholders(parentNode, +index);
        next = document.createElement(tag);
        parentNode.appendChild(next);
      } else if (next instanceof Comment || next instanceof Text) {
        // replacing existing placeholder
        const placeholder = next;
        const parentNode = placeholder.parentNode;
        next = document.createElement(tag);
        parentNode.replaceChild(next, placeholder);
      }
    } else {
      // we're only concerned with nodes and node lists
      return undefined;
    }

    const nextPath = root + component + PATH_DELIMITER;
    if (!cache[nextPath]) {
      cache[nextPath] = next;
    }
  }
  return next;
}
