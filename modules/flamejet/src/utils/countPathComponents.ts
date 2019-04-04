import {PATH_DELIMITER} from "./constants";

export function countPathComponents(path: string): number {
  let i: number = 0;
  let next: number = -1;
  do {
    next = path.indexOf(PATH_DELIMITER, next + 1);
    i++;
  } while (next > -1);
  return i;
}
