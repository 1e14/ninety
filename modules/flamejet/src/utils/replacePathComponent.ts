import {PATH_DELIMITER} from "./constants";

/**
 * Replaces the specified path component with the result of the specified
 * callback.
 * @param path
 * @param at
 * @param cb
 */
export function replacePathComponent(
  path: string,
  at: number,
  cb: (comp: string) => string
) {
  let start = 0;
  let end = path.indexOf(PATH_DELIMITER, start);
  while (at--) {
    start = end + 1;
    end = path.indexOf(PATH_DELIMITER, start);
  }
  if (end === -1) {
    return path.slice(0, start) + cb(path.slice(start));
  } else {
    return path.slice(0, start) + cb(path.slice(start, end)) + path.slice(end);
  }
}
