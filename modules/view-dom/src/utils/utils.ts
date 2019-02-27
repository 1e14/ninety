import {Diff} from "gravel-types";

/**
 * Adds placeholder comment nodes to the specified parent node up to the
 * (but not including) the specified index.
 * @param parent Parent DOM node
 * @param index Index up to which to create placeholder nodes.
 */
function addPlaceholders(parent: Node, index: number): void {
  for (let i = parent.childNodes.length; i < index; i++) {
    const placeholder = document.createComment("ph");
    parent.appendChild(placeholder);
  }
}

/**
 * Applies a single property to the DOM.
 * @param path Path to a DOM node. Elements must specify both childIndex &
 * tagName, otherwise follows hierarchy.
 * @param value Property value to be set.
 */
export function applyViewProperty(path: string, value: any): boolean {
  const keys = path.split(".");
  let tmp: any = document;
  let parent: Node = document;
  do {
    const key = keys.shift();
    if (tmp instanceof Node) {
      parent = tmp;
      tmp = tmp[key];
    } else if (tmp instanceof NodeList) {
      const [index, tagName] = key.split(",");
      const node = tmp[index];
      if (node === undefined) {
        if (tagName === undefined) {
          return false;
        }
        addPlaceholders(parent, +index);
        tmp = document.createElement(tagName);
        parent.appendChild(tmp);
      } else if (node instanceof Comment) {
        tmp = document.createElement(tagName);
        parent.replaceChild(tmp, node);
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

    if (tmp === undefined) {
      return false;
    }
  } while (keys.length);

  return true;
}

/**
 * Applies the specified view diff to the DOM.
 * @param view
 */
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
