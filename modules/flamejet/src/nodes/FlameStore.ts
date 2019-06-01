import {createNode, Node} from "flowcode";
import {Flame} from "../types";

export type In = {
  /** Samples store contents */
  a_smp: any;

  /** Flame to be stored. */
  d_val: Flame;
};

export type Out = {
  /** Flame filtered by existing content. */
  d_val: Flame;
};

/**
 * Stores flame data. Immediately emits diff on every input.
 */
export type FlameStore = Node<In, Out>;

/**
 * Creates a FlameStore node.
 */
export function createFlameStore(): FlameStore {
  return createNode<In, Out>(["d_val"], (outputs) => {
    const buffer: Flame = {};
    return {
      a_smp: (value, tag) => {
        outputs.d_val(buffer, tag);
      },

      d_val: (value, tag) => {
        const flame = {};
        for (const path in value) {
          const property = value[path];
          if (property === null) {
            if (path in buffer) {
              delete buffer[path];
              flame[path] = null;
            }
          } else if (property !== buffer[path]) {
            buffer[path] = property;
            flame[path] = property;
          }
        }
        outputs.d_val(flame, tag);
      }
    };
  });
}
