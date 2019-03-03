import {Any} from "river-core";

/**
 * Keys to be deleted.
 */
export type DiffDel<T extends Any> = Partial<{
  [key in keyof T]: any
}>;
