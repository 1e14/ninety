import {Diff} from "gravel-types";
import {Any} from "river-core";

export type DifferCallback<T extends Any> =
  (before: Partial<T>, after: Partial<T>) => Diff<T>;
