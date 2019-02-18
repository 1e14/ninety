import {Any} from "river-core";
import {Diff} from "./Diff";

export type MergerCallback<T extends Any> =
  (current: Partial<T>, diff: Diff<T>) => void;
