import {PATH_DELIMITER} from "./path";

export function getForkPos(path1: string, path2: string): number {
  let pos = 0;
  for (let i = 0; path1[i] === path2[i]; i++) {
    if (path1[i] === PATH_DELIMITER) {
      pos = i + 1;
    }
  }
  return pos;
}
