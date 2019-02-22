import {Any} from "river-core";

/**
 * Key-value pairs to be set.
 */
export type DiffSet<T extends Any> = Array<[keyof T, T[keyof T]]>;

/**
 * Keys to be deleted.
 */
export type DiffDel<T extends Any> = Array<keyof T>;

/**
 * Describes a diff to be applied to a JSON data structure.
 */
export type Diff<T extends Any> = {
  set: DiffSet<T>;
  del: DiffDel<T>;
};
