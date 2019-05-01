import {createNoop, Node} from "1e14";
import {ParentIn, ParentOut} from "./index";

export type In = ParentIn;

export type Out = ParentOut;

export type FlameMapperRoot = Node<In, Out>;

export function createFlameMapperRoot(): FlameMapperRoot {
  const input = createNoop();
  const output = createNoop();
  return {
    i: {
      d_in: input.i.d_val,
      d_out: output.i.d_val
    },
    o: {
      d_in: input.o.d_val,
      d_out: output.o.d_val
    }
  };
}
