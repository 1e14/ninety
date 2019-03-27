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
    } else if (property) {
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
