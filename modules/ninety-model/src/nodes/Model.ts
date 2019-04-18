import {createNode, Node} from "1e14";
import {Flame} from "flamejet";

export type In = {
  d_val: Flame,
  ev_smp: any
};

export type Out = {
  d_val: Flame
};

/**
 * TODO: Add invalidation
 */
export type Model = Node<In, Out>;

export function createModel(): Model {
  return createNode<In, Out>(["d_val"], (outputs) => {
    const buffer: Flame = {};
    return {
      d_val: (value, tag) => {
        // merging, diffing, and preparing output
        const flame = {};
        for (const key in value) {
          const property = value[key];
          if (property === null && key in buffer) {
            delete buffer[key];
            flame[key] = property;
          } else if (property !== buffer[key]) {
            buffer[key] = property;
            flame[key] = property;
          }
        }
        for (const key in flame) {
          // output has contents
          // emitting
          outputs.d_val(flame, tag);
          break;
        }
      },

      ev_smp: (value, tag) => {
        outputs.d_val(buffer, tag);
      }
    };
  });
}
