import {TJson} from "./TJson";

/**
 * Key-value pairs to be set.
 */
export type TDiffSet<T extends TJson> = Array<[keyof T, T[keyof T]]>;

/**
 * Keys to be deleted.
 */
export type TDiffDel<T extends TJson> = Array<keyof T>;

/**
 * Describes a diff to be applied to a JSON data structure.
 */
export interface IDiff<T extends TJson> {
  set: TDiffSet<T>;
  del: TDiffDel<T>;
}
