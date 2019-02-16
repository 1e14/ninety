import {IAny} from "@protoboard/river";

/**
 * Key-value pairs to be set.
 */
export type TDiffSet<T extends IAny> = Array<[keyof T, T[keyof T]]>;

/**
 * Keys to be deleted.
 */
export type TDiffDel<T extends IAny> = Array<keyof T>;

/**
 * Describes a diff to be applied to a JSON data structure.
 */
export interface IDiff<T extends IAny> {
  set: TDiffSet<T>;
  del: TDiffDel<T>;
}
