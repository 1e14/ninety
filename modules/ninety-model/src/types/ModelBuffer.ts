import {Flame} from "flamejet";

export type ModelBuffer<F extends Flame = Flame> = {
  [id: string]: F;
};
