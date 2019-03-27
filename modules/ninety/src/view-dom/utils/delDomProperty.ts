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
