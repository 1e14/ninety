import {Models} from "./Models";

/**
 * Configuration of expanding reference fields.
 * Indexed by model type, then by field name for model entries with named
 * fields (documents). For model entries with ID fields (collections), the
 * associated value is one of the other types.
 */
export type ReferenceConfig<T extends Models> = {
  [type in keyof T]?: keyof T | { [field in keyof T[type]]?: keyof T }
};
