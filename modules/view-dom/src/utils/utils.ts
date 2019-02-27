import {Diff} from "gravel-types";

function addPlaceholders(parent: Node, index: number): void {
  for (let i = parent.childNodes.length; i < index; i++) {
    const placeholder = document.createComment("ph");
    parent.appendChild(placeholder);
  }
}

export function applyViewProperty(path: string, value: any): boolean {
  const keys = path.split(".");
  let tmp: any = document;
  let parent: Node = document;
  do {
    const key = keys.shift();
    if (tmp instanceof Comment && key === "tagName") {
      const element = document.createElement(value);
      tmp.parentNode.replaceChild(element, tmp);
    } else if (tmp instanceof Node) {
      parent = tmp;
      tmp = tmp[key];
    } else if (tmp instanceof NodeList) {
      const [index, tagName] = key.split(",");
      if (tmp[index] === undefined) {
        if (tagName === undefined) {
          return false;
        }
        addPlaceholders(parent, +index);
        const element = document.createElement(tagName);
        parent.appendChild(element);
        tmp = element;
      } else {
        tmp = tmp[index];
      }
    } else if (tmp instanceof NamedNodeMap && !tmp.getNamedItem(key)) {
      const attribute = document.createAttribute(key);
      attribute.value = value;
      tmp.setNamedItem(attribute);
    } else if (tmp instanceof DOMTokenList) {
      tmp.add(key, key);
    } else {
      tmp = tmp[key];
    }
  } while (tmp !== undefined && keys.length);

  return tmp !== undefined;
}

export function applyView<T>(view: Diff<T>): Diff<T> {
  const bounced: Diff<T> = {
    del: {},
    set: {}
  };
  for (const [path, value] of Object.entries(view.set)) {
    if (!applyViewProperty(path, value)) {
      bounced.set[path] = value;
    }
  }
  return bounced;
}
