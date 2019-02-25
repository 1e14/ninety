export const pathValueCache = {};

export function setDomPath(path: string, value: any): void {
  const keys = path.split(".");
  let tmp: any = document;
  let parent: Node = document;
  do {
    const key = keys.shift();
    if (tmp instanceof Comment) {
      if (key === "tagName") {
        const element = document.createElement(key);
        tmp.parentNode.replaceChild(element, tmp);
      }
    } else if (tmp instanceof Node) {
      parent = tmp;
      tmp = tmp[key];
    } else if (tmp instanceof NodeList) {
      if (tmp[key] === undefined) {
        addPlaceholders(parent, parseInt(key, 10));
        pathValueCache[path] = value;
      } else {
        tmp = tmp[key];
      }
    } else if (tmp instanceof NamedNodeMap) {
      if (!tmp.getNamedItem(key)) {
        const attribute = document.createAttribute(key);
        attribute.value = value;
        tmp.setNamedItem(attribute);
      }
    } else if (tmp instanceof DOMTokenList) {
      tmp.add(key, key);
    } else {
      tmp = tmp[key];
    }
  } while (tmp !== undefined && keys.length);
}

export function addPlaceholders(parent: Node, index: number): void {
  for (let i = parent.childNodes.length; i <= index; i++) {
    const placeholder = document.createComment("ph");
    parent.appendChild(placeholder);
  }
}
