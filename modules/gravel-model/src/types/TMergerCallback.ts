import {IAny} from "@protoboard/river";
import {IDiff} from "./IDiff";

export type TMergerCallback<T extends IAny> =
  (current: Partial<T>, diff: IDiff<T>) => void;
