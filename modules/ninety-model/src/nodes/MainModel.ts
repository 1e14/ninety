import {createNoop, Node} from "1e14";
import {Flame} from "flamejet";

export type In = {
  d_model: Flame;
};

export type Out = {
  d_model: Flame;
};

export type MainModel = Node<In, Out>;

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
