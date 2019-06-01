import {createNoop, Node} from "flowcode";
import {FlameBodyMapperIn, FlameBodyMapperOut} from "./index";

export type In = FlameBodyMapperIn;

export type Out = FlameBodyMapperOut;

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
