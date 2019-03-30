import {Flame} from "../../flame/types";
import {PATH_DELIMITER} from "../../flame/utils";

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

    next = property[component]; // TODO
    if (!next) {
      next = property[component] = {}; // TODO
    }

    const parentPath = root + component + PATH_DELIMITER;
    if (!cache[parentPath]) {
      cache[parentPath] = next;
    }
  }
  return next;
}
