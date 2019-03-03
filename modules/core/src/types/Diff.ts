import {Any} from "river-core";

/**
 * Key-value pairs to be set.
 */
export type DiffSet<T extends Any> = Partial<T>;

/**
 * Keys to be deleted.
 */
export type DiffDel<T extends Any> = Partial<{
  [key in keyof T]: any
}>;

/**
 * Describes a diff to be applied to a JSON data structure.
 */
export type Diff<T extends Any> = {
  set?: DiffSet<T>;
  del?: DiffDel<T>;
};
