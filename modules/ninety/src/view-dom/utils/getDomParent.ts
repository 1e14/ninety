import {Flame} from "../../flame/types";
import {PATH_DELIMITER} from "../../flame/utils";
import {PATH_TAG_DELIMITER} from "./fetchDomParent";

/**
 * Retrieves parent DOM property for the specified DOM path, starting at
 * the specified position in the path.
 * @param cache Lookup of DOM properties by path.
 * @param path Path to fetch parent property for.
 * @param from Starting position in path.
 */
export function getDomParent(cache: Flame, path: string, from: number = 0): any {
  let next: any;
  for (
    let to = path.indexOf(PATH_DELIMITER, from);
    to > -1;
    from = to + 1, to = path.indexOf(PATH_DELIMITER, from)
  ) {
    const root = path.slice(0, from);
    const component = path.slice(from, to);
    const property = cache[root];

    if (property instanceof Node) {
      next = property[component];
    } else if (property instanceof NodeList) {
      const [index] = component.split(PATH_TAG_DELIMITER);
      next = property[index];
    } else {
      // we're only concerned with nodes and node lists
      return undefined;
    }

    const nextPath = root + component + PATH_DELIMITER;
    if (!cache[nextPath]) {
      cache[nextPath] = next;
    }
  }
  return next;
}
