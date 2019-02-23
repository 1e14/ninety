import {Any} from "river-core";
import {Collection, createCollection, createField, Field} from "../nodes";

const fields: Map<string, Field<any>> = new Map();

export function getField(key: string) {
  let node = fields.get(key);
  if (!node) {
    node = createField();
    fields.set(key, node);
  }
  return node;
}

const collections: Map<string, Collection<any>> = new Map();

export function getCollection(key: string) {
  let node = collections.get(key);
  if (!node) {
    node = createCollection();
    collections.set(key, node);
  }
  return node;
}

export function isEmptyObject(object: Any) {
  for (const key in object) {
    return false;
  }
  return true;
}
