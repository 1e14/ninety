import {Flame} from "flamejet";
import {Model} from "./Model";

export type Models<S extends Flame> = {
  d_model: Model<S>
} & {
  [type: string]: Model<S>;
};
