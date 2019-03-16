import {Any} from "river-core";

/**
 * Keys to be deleted.
 * @deprecated Use FlameDiff
 */
export type DiffDel<T extends Any> = Partial<{
  [key in keyof T]: any
}>;
