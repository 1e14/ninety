import {createNode, Node} from "1e14";
import {Flame} from "../types";

export type In = {
  d_val: Flame;
  ev_res: any;
};

export type Out = {
  d_val: Flame;
};

export type FlameBuffer = Node<In, Out>;

export function createFlameBuffer(): FlameBuffer {
  let buffer: Flame = {};

  return createNode<In, Out>
  (["d_val"], (outputs) => ({
    d_val: (value) => {
      for (const path in value) {
        buffer[path] = value[path];
      }
    },

    ev_res: (value, tag) => {
      for (const path in buffer) {
        outputs.d_val(buffer, tag);
        buffer = {};
        break;
      }
    }
  }));
}
