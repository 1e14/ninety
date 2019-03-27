import {Flame, FlameDiff, getRootPath, NullFlame} from "../../flame";
import {getDomProperty} from "./getDomProperty";
import {setDomProperty} from "./setDomProperty";

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
    } else if (property) {
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
 * TODO: Tests
 * @param diffDel
 */
function applyDomDiffDel(diffDel: NullFlame): NullFlame {
  const bounced = {};
  const root = getRootPath(diffDel);
  let applied = true;
  if (root) {
    const {node, property} = getDomProperty(root);
    if (node) {
      for (const path in diffDel) {
        const success = delDomProperty(
          property,
          node,
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
 * @param diffSet
 */
function applyDomDiffSet(diffSet: Flame): Flame {
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
export function applyDomDiff(diff: FlameDiff): FlameDiff {
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
