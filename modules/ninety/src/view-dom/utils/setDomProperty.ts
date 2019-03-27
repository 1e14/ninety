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
 * @param property Root Property
 * @param node Root parent node
 * @param path Path to a DOM property. Elements must specify both childIndex &
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
