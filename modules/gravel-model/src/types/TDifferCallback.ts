import {IAny} from "@protoboard/river";
import {IDiff} from "./IDiff";

export type TDifferCallback<T extends IAny> =
  (before: Partial<T>, after: Partial<T>) => IDiff<T>;
