import {Diff} from "gravel-types";
import {Any} from "river-core";

export type MergerCallback<T extends Any> =
  (current: Partial<T>, diff: Diff<T>) => void;
