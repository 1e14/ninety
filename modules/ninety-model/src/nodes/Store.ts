import {createNode, Node} from "1e14";
import {Flame, getPathComponent} from "flamejet";
import {ModelBuffer} from "../types";

export type In = {
  /** Model coming from API or view-model. */
  d_model: Flame;

  /** Sampling signal. */
  ev_smp: {
    /** Identifies model entry */
    id: string;
  };
};

export type Out = {
  /** Sampled / diff-ed model. */
  d_model: Flame;
};

/**
 * Stores model entries. Allows setting and querying model data.
 * The first component in model flame paths is expected to identify the
 * entry in the model.
 * TODO: Add invalidation
 */
export type Store = Node<In, Out>;

/**
 * Creates a Store node.
 */
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
