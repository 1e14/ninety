import {Flame} from "../../flame/types";
import {PATH_DELIMITER} from "../../flame/utils";

export function getDomParent(cache: Flame, path: string, from: number = 0): any {
  let parent: any;
  for (
    let to = path.indexOf(PATH_DELIMITER, from);
    to > -1;
    from = to + 1, to = path.indexOf(PATH_DELIMITER, from)
  ) {
    const root = path.slice(0, from);
    const component = path.slice(from, to);
    const node = cache[root];
    parent = node[component]; // TODO
    if (!parent) {
      parent = node[component] = {}; // TODO
      cache[root + component + PATH_DELIMITER] = parent;
    }
  }
  return parent;
}
