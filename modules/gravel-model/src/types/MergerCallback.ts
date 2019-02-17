import {Any} from "@protoboard/river";
import {Diff} from "./Diff";

export type MergerCallback<T extends Any> =
  (current: Partial<T>, diff: Diff<T>) => void;
