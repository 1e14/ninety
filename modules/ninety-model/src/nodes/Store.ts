import {createNode, Node} from "1e14";
import {Flame, getPathComponent} from "flamejet";
import {ModelBuffer} from "../types";

export type In = {
  d_model: Flame
  ev_smp: {
    id: string;
  }
};

export type Out = {
  d_model: Flame
};

/**
 * TODO: Add invalidation
 */
export type Store = Node<In, Out>;

export function createStore(): Store {
  return createNode<In, Out>(["d_model"], (outputs) => {
    const buffer: ModelBuffer = {};
    return {
      d_model: (value, tag) => {
        const diff = {};
        for (const path in value) {
          const id = getPathComponent(path, 0);

          // fetching model from buffer
          let model = buffer[id];
          if (!model) {
            model = buffer[id] = {};
          }

          // applying incoming model
          const property = value[path];
          if (property === null && path in model) {
            delete model[path];
            diff[path] = null;
          } else if (property !== model[path]) {
            model[path] = property;
            diff[path] = property;
          }
        }

        for (const path in diff) {
          // output has contents
          // emitting diff
          outputs.d_model(diff, tag);
          break;
        }
      },

      ev_smp: ({id}, tag) => {
        outputs.d_model(buffer[id], tag);
      }
    };
  });
}
