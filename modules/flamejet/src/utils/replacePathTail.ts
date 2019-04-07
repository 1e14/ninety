import {PATH_DELIMITER} from "./PATH_DELIMITER";

/**
 * Replaces the specified path component and the rest of the path with the
 * result of the specified callback.
 * @param path
 * @param cb
 */
export function replacePathTail(
  path: string,
  cb: (comp: string) => string
): string {
  const pos = path.lastIndexOf(PATH_DELIMITER);
  return path.slice(0, pos + 1) + cb(path.slice(pos + 1));
}
