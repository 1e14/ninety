import {Any} from "river-core";
import {Diff} from "./Diff";

export type DifferCallback<T extends Any> =
  (before: Partial<T>, after: Partial<T>) => Diff<T>;
