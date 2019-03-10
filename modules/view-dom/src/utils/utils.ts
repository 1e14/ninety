import {Diff} from "gravel-core";
import {Any} from "river-core";

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
 * Sets a single property in the DOM.
 * @param path Path to a DOM property. Elements must specify both childIndex &
 * tagName, otherwise follows hierarchy.
 * @param value Property value to be set.
 */
export function setDomProperty(path: string, value: any): boolean {
  const components = path.split(".");
  let property: any = document;
  let node: Node = document;
  while (components.length && property !== undefined) {
    const component = components.shift();
    if (property instanceof Node) {
      if (components.length) {
        // going on to the specified property
        property = property[component];
      } else {
        // node property
        property[component] = value;
        return true;
      }
    } else if (property instanceof NodeList) {
      // extracting child index & tagName from path component
      const [index, tagName] = component.split(":");
      const child = property[index];
      if (child === undefined) {
        if (tagName === undefined) {
          // no tagName - can't proceed
          return false;
        }
        addPlaceholders(node, +index);
        property = document.createElement(tagName);
        node.appendChild(property);
      } else if (child instanceof Comment || child instanceof Text) {
        // replacing existing placeholder
        property = document.createElement(tagName);
        node.replaceChild(property, child);
      } else {
        // in any other case - proceed to specified property
        property = property[index];
      }
    } else if (property instanceof NamedNodeMap) {
      // attributes
      let attribute = property.getNamedItem(component);
      if (!attribute) {
        attribute = document.createAttribute(component);
        property.setNamedItem(attribute);
      }
      attribute.value = value;
      return true;
    } else if (property instanceof DOMTokenList) {
      // CSS classes
      property.add(component, component);
      return true;
    } else if (property instanceof CSSStyleDeclaration) {
      // CSS styles
      property[component] = value;
      return true;
    } else {
      // unrecognized property parent
      return false;
    }

    if (property instanceof Node) {
      node = property;
    }
  }
}

/**
 * Deletes a single property from the DOM.
 * @param path Path to DOM node.
 */
export function delDomProperty(path: string): boolean {
  const components = path.split(".");
  let property: any = document;
  let node: Node = document;
  let component: string;

  // finding property
  for (
    let i = 0, length = components.length - 1;
    i < length && property !== undefined;
    i++
  ) {
    component = components.shift();
    if (property instanceof Node) {
      property = property[component];
    } else if (property instanceof NodeList) {
      const [index] = component.split(":");
      property = property[index];
    } else {
      property = property[component];
    }

    if (property instanceof Node) {
      node = property;
    }
  }

  // deleting property
  component = components.shift();
  if (property instanceof Node) {
    // node property
    property[component] = null;
  } else if (property instanceof NodeList) {
    // extracting child index from path component
    const [index] = component.split(":");
    const child = property[index];
    if (child !== undefined) {
      // replacing child w/ placeholder
      property = document.createComment("");
      node.replaceChild(property, child);
    }
  } else if (property instanceof NamedNodeMap) {
    // attributes
    property.removeNamedItem(component);
  } else if (property instanceof DOMTokenList) {
    // CSS classes
    property.remove(component);
  } else if (property instanceof CSSStyleDeclaration) {
    // CSS styles
    property[component] = null;
  } else {
    // unrecognized property parent
    return false;
  }

  return true;
}

/**
 * Applies the specified view diff to the DOM.
 * @param diff
 */
export function applyDomDiff(diff: Diff<Any>): Diff<Any> | true {
  const bounced = {del: {}, set: {}};
  const viewSet = diff.set;
  const viewDel = diff.del;
  const bouncedSet = bounced.set;
  const bouncedDel = bounced.del;
  let applied = true;
  for (const path in viewDel) {
    if (!delDomProperty(path)) {
      bouncedDel[path] = null;
      applied = false;
    }
  }
  for (const path in viewSet) {
    const value = viewSet[path];
    if (!setDomProperty(path, value)) {
      bouncedSet[path] = value;
      applied = false;
    }
  }
  return applied || bounced;
}
