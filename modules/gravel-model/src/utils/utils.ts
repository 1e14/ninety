import {createCollection, createField, TCollection, TField} from "../nodes";

const fields: Map<string, TField<any>> = new Map();

export function getField(key: string) {
  let node = fields.get(key);
  if (!node) {
    node = createField();
    fields.set(key, node);
  }
  return node;
}

const collections: Map<string, TCollection<any>> = new Map();

export function getCollection(key: string) {
  let node = collections.get(key);
  if (!node) {
    node = createCollection();
    collections.set(key, node);
  }
  return node;
}
