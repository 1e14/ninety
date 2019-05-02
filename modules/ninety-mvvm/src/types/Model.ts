import {Flame} from "flamejet";

/**
 * "Model" stands for a collection of uniform set of key/value-pairs.
 * Type parameter S describes the model schema.
 */
export type Model<S extends Flame> = {
  [id: string]: S;
};
