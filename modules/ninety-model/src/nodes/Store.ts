import {createNode, Node} from "1e14";
import {Flame} from "flamejet";
import {ModelBuffer} from "../types";

export type In<F extends Flame> = {
  /** Invalidates model entries. */
  a_inv: Array<string>;

  /** Samples buffered model entries. */
  a_smp: Array<string>;

  /** Model coming from API or view-model. */
  d_model: ModelBuffer<F>;
};

export type Out<F extends Flame> = {
  /** Sampled / diff-ed model. */
  d_model: ModelBuffer<F>;

  /** Signals change of validity in model entries */
  ev_inv: {
    [id: string]: boolean
  }
};

/**
 * Stores model entries. Allows setting, querying and invalidating model data.
 */
export type Store<F extends Flame> = Node<In<F>, Out<F>>;

/**
 * Creates a Store node.
 */
export function createStore<F extends Flame>(): Store<F> {
  return createNode<In<F>, Out<F>>(["d_model", "ev_inv"], (outputs) => {
    const buffer: ModelBuffer<F> = {};
    const invalid: { [id: string]: true } = {};
    return {
      a_inv: (value, tag) => {
        const invalidDiff = {};
        for (let i = 0, count = value.length; i < count; i++) {
          const id = value[i];
          if (id in buffer && !(id in invalid)) {
            invalid[id] = true;
            invalidDiff[id] = true;
          }
        }
        for (const id in invalidDiff) {
          outputs.ev_inv(invalidDiff, tag);
          break;
        }
      },

      a_smp: (value, tag) => {
        const modelOut = <ModelBuffer<F>>{};
        for (let i = 0, count = value.length; i < count; i++) {
          const id = value[i];
          modelOut[id] = id in buffer ?
            buffer[id] :
            null;
        }
        outputs.d_model(modelOut, tag);
      },

      d_model: (value, tag) => {
        const bufferDiff = <ModelBuffer<F>>{};
        const invalidDiff = {};
        for (const id in value) {
          if (!(id in invalidDiff) && id in invalid) {
            // resetting invalid state
            delete invalid[id];
            invalidDiff[id] = false;
          }

          const entryIn = value[id];
          if (entryIn === null) {
            // entry is nulled out in input
            if (id in buffer) {
              // removing whole entry
              delete buffer[id];
              bufferDiff[id] = null;
            }
          } else {
            // initializing buffer & output entries
            let entryBuf = buffer[id];
            if (!entryBuf) {
              entryBuf = buffer[id] = <F>{};
            }
            let entryDiff = bufferDiff[id];
            if (!entryDiff) {
              entryDiff = bufferDiff[id] = <F>{};
            }

            // applying incoming entry to buffer and extracting diff for output
            for (const path in entryIn) {
              const property = entryIn[path];
              if (property === null && path in entryBuf) {
                delete entryBuf[path];
                entryDiff[path] = null;
              } else if (property !== entryBuf[path]) {
                entryBuf[path] = property;
                entryDiff[path] = property;
              }
            }
          }
        }
        // TODO: Emit empty diff?
        for (const id in bufferDiff) {
          // model diff has contents
          // emitting model changes
          outputs.d_model(bufferDiff, tag);
          break;
        }
        for (const id in invalidDiff) {
          // invalidation diff has contents
          // emitting invalidation changes
          outputs.ev_inv(invalidDiff, tag);
          break;
        }
      }
    };
  });
}
