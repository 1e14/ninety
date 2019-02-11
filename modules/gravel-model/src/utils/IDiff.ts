import {TJson} from "./TJson";
import {TPath} from "./TPath";

/**
 * Lists key-value pairs to set.
 */
type TDiffSet<T extends TJson> = {
  [P in TPath]: T;
};

/**
 * Lists key-value pairs to delete.
 */
type TDiffDel<T extends TJson> = Array<keyof T>;

/**
 * Describes a diff to be applied to a tree data structure.
 */
export interface IDiff<T extends TJson> {
  set: TDiffSet<T>;
  del: TDiffDel<T>;
}
