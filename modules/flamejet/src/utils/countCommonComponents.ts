import {PATH_DELIMITER} from "./constants";
import {countPathComponents} from "./countPathComponents";

export function countCommonComponents(path1: string, path2: string): number {
  if (path1 === path2) {
    return countPathComponents(path1);
  } else {
    let pos = 0;
    let i = 0;
    while (path1[i] === path2[i]) {
      if (path1[i] === PATH_DELIMITER) {
        pos++;
      }
      i++;
    }
    if (i === path1.length || i === path2.length) {
      pos++;
    }
    return pos;
  }
}
