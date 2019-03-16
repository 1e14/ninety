import {Any} from "river-core";
import {DiffDel} from "./DiffDel";
import {DiffSet} from "./DiffSet";

/**
 * Describes a diff to be applied to a JSON data structure.
 * @deprecated Use FlameDiff
 */
export type Diff<T extends Any> = {
  set: DiffSet<T>;
  del: DiffDel<T>;
};
