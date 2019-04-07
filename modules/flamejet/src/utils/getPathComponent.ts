import {PATH_DELIMITER} from "./PATH_DELIMITER";

/**
 * Retrieves the specified path component.
 * Not protected from out-of-bounds indexes for performance reasons.
 * @param path
 * @param index
 * @link https://jsperf.com/path-component-extraction
 */
export function getPathComponent(path: string, index: number): string {
  let start = 0;
  let end = path.indexOf(PATH_DELIMITER, start);
  while (index--) {
    start = end + 1;
    end = path.indexOf(PATH_DELIMITER, start);
  }
  if (end === -1) {
    return path.substring(start);
  } else {
    return path.substring(start, end);
  }
}
