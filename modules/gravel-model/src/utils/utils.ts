import {createField, TField} from "../nodes";

const cache: Map<string, TField<any>> = new Map();

export function getField(key: string) {
  let node = cache.get(key);
  if (!node) {
    node = createField();
    cache.set(key, node);
  }
  return node;
}
