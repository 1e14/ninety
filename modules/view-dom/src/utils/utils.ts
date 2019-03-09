import {Diff} from "gravel-core";
import {Any} from "river-core";

/**
 * Adds placeholder comment nodes to the specified parent node up to the
 * (but not including) the specified index.
 * @param parent Parent DOM node
 * @param index Index up to which to create placeholder nodes.
 */
function addPlaceholders(parent: Node, index: number): void {
  for (let i = parent.childNodes.length; i < index; i++) {
    const placeholder = document.createComment("");
    parent.appendChild(placeholder);
  }
}

/**
 * Retrieves a property from the DOM.
 * @param path Path to a DOM property.
 */
export function getDomProperty(path: string): any {
  const components = path.split(".");
  let tmp: any = document;
  let parent: Node = document;
  let component: string;

  while (components.length && tmp !== undefined) {
    component = components.shift();
    if (tmp instanceof Node) {
      tmp = tmp[component];
    } else if (tmp instanceof NodeList) {
      const [index] = component.split(":");
      tmp = tmp[index];
    } else if (tmp instanceof NamedNodeMap) {
      // attributes
      tmp = tmp.getNamedItem(component);
    } else if (tmp instanceof DOMTokenList) {
      // CSS classes
      tmp = tmp.contains(component);
    } else {
      // CSS styles
      // and everything else
      tmp = tmp[component];
    }

    if (tmp instanceof Node) {
      parent = tmp;
    }
  }

  return tmp;
}

/**
 * Retrieves closest Node to the specified path in the DOM.
 * @param path Path to a DOM property.
 */
export function getClosestDomNode(path: string): any {
  const components = path.split(".");
  let tmp: any = document;
  let parent: Node = document;
  let component: string;

  // finding parent node / property
  while (components.length && tmp !== undefined) {
    component = components.shift();
    if (tmp instanceof Node) {
      tmp = tmp[component];
    } else if (tmp instanceof NodeList) {
      const [index] = component.split(":");
      tmp = tmp[index];
    } else if (tmp instanceof NamedNodeMap) {
      // attributes
      tmp = tmp.getNamedItem(component);
    } else {
      // CSS styles
      // and everything else
      tmp = tmp[component];
    }

    if (tmp instanceof Node) {
      parent = tmp;
    }
  }

  return parent;
}

/**
 * Sets a single property in the DOM.
 * @param property Root Property
 * @param parent Root parent node
 * @param path Path to a DOM node. Elements must specify both childIndex &
 * tagName, otherwise follows hierarchy.
 * @param value Property value to be set.
 */
export function setDomProperty(property: any, parent: Node, path: string, value: any): boolean {
  const components = path.split(".");
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
      const node = property[index];
      if (node === undefined) {
        if (tagName === undefined) {
          // no tagName - can't proceed
          return false;
        }
        addPlaceholders(parent, +index);
        property = document.createElement(tagName);
        parent.appendChild(property);
      } else if (node instanceof Comment || node instanceof Text) {
        // replacing existing placeholder
        property = document.createElement(tagName);
        parent.replaceChild(property, node);
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
      parent = property;
    }
  }
}

/**
 * Deletes a single property from the DOM.
 * @param property Root Property
 * @param parent Root parent node
 * @param path Path to DOM node.
 */
export function delDomProperty(property: any, parent: Node, path: string): boolean {
  const components = path.split(".");
  let component: string;

  // finding parent node / property
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
      parent = property;
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
    const node = property[index];
    if (node !== undefined) {
      // replacing node w/ placeholder
      property = document.createComment("");
      parent.replaceChild(property, node);
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
    if (!delDomProperty(document, document, path)) {
      bouncedDel[path] = null;
      applied = false;
    }
  }
  for (const path in viewSet) {
    const value = viewSet[path];
    if (!setDomProperty(document, document, path, value)) {
      bouncedSet[path] = value;
      applied = false;
    }
  }
  return applied || bounced;
}
