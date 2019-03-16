import {Flame} from "./Flame";
import {NullFlame} from "./NullFlame";

export type FlameDiff = {
  set: Flame;
  del: NullFlame;
};
