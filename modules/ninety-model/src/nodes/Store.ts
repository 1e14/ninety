import {createNode, Node} from "1e14";
import {Flame} from "flamejet";
import {ModelBuffer, ModelQuery} from "../types";

export type In<F extends Flame> = {
  /** Model coming from API or view-model. */
  d_model: ModelBuffer<F>;

  /** Sampling signal. */
  ev_smp: ModelQuery;
};

export type Out<F extends Flame> = {
  /** Sampled / diff-ed model. */
  d_model: ModelBuffer<F>;
};

/**
 * Stores model entries. Allows setting and querying model data.
 * The first component in model flame paths is expected to identify the
 * entry in the model.
 * TODO: Add invalidation
 */
export type Store<F extends Flame> = Node<In<F>, Out<F>>;

/**
 * Creates a Store node.
 */
export function createStore<F extends Flame>(): Store<F> {
  return createNode<In<F>, Out<F>>(["d_model"], (outputs) => {
    const buffer: ModelBuffer<F> = {};
    return {
      d_model: (value, tag) => {
        const modelOut = <ModelBuffer<F>>{};
        for (const id in value) {
          const entryIn = value[id];
          if (entryIn === null) {
            // entry is nulled out in input
            if (id in buffer) {
              // removing whole entry
              delete buffer[id];
              modelOut[id] = null;
            }
          } else {
            // initializing buffer & output entries
            let entryBuf = buffer[id];
            if (!entryBuf) {
              entryBuf = buffer[id] = <F>{};
            }
            let entryOut = modelOut[id];
            if (!entryOut) {
              entryOut = modelOut[id] = <F>{};
            }

            // applying incoming entry to buffer and extracting diff for output
            for (const path in entryIn) {
              const property = entryIn[path];
              if (property === null && path in entryBuf) {
                delete entryBuf[path];
                entryOut[path] = null;
              } else if (property !== entryBuf[path]) {
                entryBuf[path] = property;
                entryOut[path] = property;
              }
            }
          }
        }
        for (const id in modelOut) {
          // output has contents
          // emitting diffed model buffer
          outputs.d_model(modelOut, tag);
          break;
        }
      },

      ev_smp: ({ids}, tag) => {
        const modelOut = <ModelBuffer<F>>{};
        for (let i = 0, count = ids.length; i < count; i++) {
          const id = ids[i];
          modelOut[id] = id in buffer ?
            buffer[id] :
            null;
        }
        outputs.d_model(modelOut, tag);
      }
    };
  });
}
