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
  const comps = path.split(".");
  let tmp: any = document;
  let parent: Node = document;
  do {
    const comp = comps.shift();
    if (tmp instanceof Node) {
      // setting current node as last parent, and going on to the specified
      // property
      parent = tmp;
      tmp = tmp[comp];
    } else if (tmp instanceof NodeList) {
      // extracting child index & tagName from path component
      const [index, tagName] = comp.split(":");
      const node = tmp[index];
      if (node === undefined) {
        if (tagName === undefined) {
          // no tagName - can't proceed
          return false;
        }
        addPlaceholders(parent, +index);
        tmp = document.createElement(tagName);
        parent.appendChild(tmp);
      } else if (node instanceof Comment) {
        // replacing existing placeholder
        tmp = document.createElement(tagName);
        parent.replaceChild(tmp, node);
      } else {
        // in any other case - proceed to specified property
        tmp = tmp[index];
      }
    } else if (tmp instanceof NamedNodeMap) {
      // attributes
      let attribute = tmp.getNamedItem(comp);
      if (!attribute) {
        attribute = document.createAttribute(comp);
        tmp.setNamedItem(attribute);
      }
      attribute.value = value;
    } else if (tmp instanceof DOMTokenList) {
      // CSS classes
      tmp.add(comp, comp);
    } else {
      // in any other case - proceed to specified property
      tmp = tmp[comp];
    }

    if (tmp === undefined) {
      return false;
    }
  } while (comps.length);

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

export function prependPaths<T>(
  diff: Diff<T>, prefix: string
): Diff<{ [key: string]: T[keyof T] }> {
  const del = {};
  const set = {};
  for (const key in diff.set) {
    set[prefix + key] = diff.set[key];
  }
  for (const key in diff.del) {
    del[prefix + key] = diff.del[key];
  }
  return {set, del};
}
