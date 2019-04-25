import {Flame} from "flamejet";

export type FlamesByModelType = {
  d_model: Flame;
} & {
  [type: string]: Flame;
};
