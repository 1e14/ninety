import {Flame} from "flamejet";

export type ModelBuffer<F extends Flame> = {
  [id: string]: F;
};
