import {countPathComponents, getPathComponent} from "../../flame/utils";
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

export function fetchDomParent(stack: Array<any>, path: string): any {
  const stackSize = stack.length;
  const parentDepth = countPathComponents(path) - 1;
  let property = stack[stackSize - 1];

  for (let i = stackSize; i < parentDepth; i++) {
    const component = getPathComponent(path, i);
    if (property instanceof Node) {
      // adding context to node list if necessary
      const childNodes = <ContextualNodeListOf<ChildNode>>property.childNodes;
      if (!childNodes.context) {
        childNodes.context = property;
      }
      property = property[component];
    } else if (property instanceof NodeList) {
      const [index, tag = DEFAULT_TAG_NAME] = component.split(PATH_TAG_DELIMITER);
      // adding/replacing DOM element when necessary
      const next = property[index];
      if (next instanceof Element && next.tagName === tag) {
        // matching child node exists
        property = next;
      } else if (!next) {
        // child node does not exist at all
        const parentNode = (<ContextualNodeListOf<ChildNode>>property).context;
        addPlaceholders(parentNode, +index);
        property = document.createElement(tag);
        parentNode.appendChild(property);
      } else {
        // replacing existing property (placeholder)
        const placeholder = next;
        const parentNode = placeholder.parentNode;
        property = document.createElement(tag);
        parentNode.replaceChild(property, placeholder);
      }
    } else {
      // we're only concerned with nodes and node lists
      return undefined;
    }
    stack.push(property);
  }

  return property;
}
