/**
 * Called for each path/value pair while traversing a flame.
 * @param path Current path
 * @param value Current value
 * @param start Index of the first non-matching path component compared to
 * the previously traversed one.
 */
export type FlameTraversalCallback = (
  path: string,
  value: any,
  start: number
) => void;
