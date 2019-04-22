import {createNode, Node} from "1e14";
import {Flame} from "../types";

export type In = {
  /** Flame to be buffered. */
  d_val: Flame;

  /** Resets buffer */
  a_res: any;
};

export type Out = {
  /** Buffered flame. */
  d_val: Flame;
};

/**
 * Buffers flame and releases contents on reset.
 */
export type FlameBuffer = Node<In, Out>;

/**
 * Creates a FlameBuffer node.
 */
export function createFlameBuffer(): FlameBuffer {
  let buffer: Flame = {};

  return createNode<In, Out>
  (["d_val"], (outputs) => ({
    d_val: (value) => {
      for (const path in value) {
        buffer[path] = value[path];
      }
    },

    a_res: (value, tag) => {
      for (const path in buffer) {
        outputs.d_val(buffer, tag);
        buffer = {};
        break;
      }
    }
  }));
}
