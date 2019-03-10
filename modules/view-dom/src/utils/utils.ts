import {Diff, DiffDel, DiffSet, getRootPath} from "gravel-core";
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
 * Retrieves a property from the DOM.
 * @param path Path to a DOM property.
 */
export function getDomProperty(path: string): { node: Node, property: any } {
  const components = path.split(".");
  let property: any = document;
  let node: Node = document;
  let component: string;

  while (components.length && property !== undefined) {
    component = components.shift();
    if (property instanceof Node) {
      property = property[component];
    } else if (property instanceof NodeList) {
      const [index] = component.split(":");
      property = property[index];
    } else if (property instanceof NamedNodeMap) {
      // attributes
      property = property.getNamedItem(component);
    } else if (property instanceof DOMTokenList) {
      // CSS classes
      property = property.contains(component);
    } else {
      // CSS styles
      // and everything else
      property = property[component];
    }

    if (property instanceof Node) {
      node = property;
    }
  }

  return property && {node, property};
}

/**
 * Sets a single property in the DOM.
 * @param property Root Property
 * @param node Root parent node
 * @param path Path to a DOM node. Elements must specify both childIndex &
 * tagName, otherwise follows hierarchy.
 * @param value Property value to be set.
 */
export function setDomProperty(property: any, node: Node, path: string, value: any): boolean {
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
 * @param property Root Property
 * @param node Root parent node
 * @param path Path to DOM node.
 */
export function delDomProperty(property: any, node: Node, path: string): boolean {
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
      // replacing node w/ placeholder
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
 * TODO: Tests
 * @param diffDel
 */
function applyDomDiffDel(diffDel: DiffDel<Any>): DiffDel<Any> {
  const bounced = {};
  const root = getRootPath(diffDel);
  let applied = true;
  if (root) {
    const {node, property} = getDomProperty(root);
    if (node) {
      for (const path in diffDel) {
        const success = delDomProperty(
          node,
          property,
          path.substr(root.length + 1));
        if (!success) {
          bounced[path] = null;
          applied = false;
        }
      }
    }
  } else {
    for (const path in diffDel) {
      if (!delDomProperty(document, document, path)) {
        bounced[path] = null;
        applied = false;
      }
    }
  }
  return applied ? undefined : bounced;
}

/**
 * TODO: Tests
 * @param diffSet
 */
function applyDomDiffSet(diffSet: DiffSet<Any>): DiffSet<Any> {
  const bounced = {};
  const root = getRootPath(diffSet);
  let applied = true;
  if (root) {
    for (const path in diffSet) {
      setDomProperty(document, document, path, diffSet[path]);
      break;
    }
    const {node, property} = getDomProperty(root);
    for (const path in diffSet) {
      const value = diffSet[path];
      const success = setDomProperty(
        property,
        node,
        path.substr(root.length + 1),
        value);
      if (!success) {
        bounced[path] = value;
        applied = false;
      }
    }
  } else {
    for (const path in diffSet) {
      const value = diffSet[path];
      if (!setDomProperty(document, document, path, value)) {
        bounced[path] = value;
        applied = false;
      }
    }
  }
  return applied ? undefined : bounced;
}

/**
 * Applies the specified view diff to the DOM.
 * @param diff
 */
export function applyDomDiff(diff: Diff<Any>): Diff<Any> {
  const diffDel = diff.del;
  const diffSet = diff.set;
  const bouncedDel = applyDomDiffDel(diffDel);
  const bouncedSet = applyDomDiffSet(diffSet);
  return bouncedDel === undefined && bouncedSet === undefined ?
    undefined :
    {
      del: bouncedDel || {},
      set: bouncedSet || {}
    };
}
