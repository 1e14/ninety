import {Flame} from "flamejet";

export type Model<F extends Flame = Flame> = {
  [id: string]: F;
};
