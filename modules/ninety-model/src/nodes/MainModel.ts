import {createNoop, Node} from "1e14";
import {Flame} from "flamejet";

export type In = {
  /** Model received from expanders. */
  d_model: Flame;
};

export type Out = {
  /** Model passed on to view-models. */
  d_model: Flame;
};

/**
 * Joins all (expanded) models tobe processed by the view-model layer.
 */
export type MainModel = Node<In, Out>;

/**
 * Creates a MainModule node.
 */
export function createMainModel(): MainModel {
  const model = createNoop();
  return {
    i: {
      d_model: model.i.d_val
    },
    o: {
      d_model: model.o.d_val
    }
  };
}
