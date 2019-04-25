import {createNode, Node} from "1e14";
import {Flame} from "flamejet";
import {IdList, Model} from "../types";

export type In<F extends Flame> = {
  /** Invalidates model entries. */
  a_inv: IdList;

  /** Samples buffered model entries. */
  a_smp: IdList;

  /** Model coming from API or view-model. */
  d_model: Model<F>;
};

export type Out<F extends Flame> = {
  /** Sampled / diff-ed model. */
  d_model: Model<F>;

  /** Signals change of validity in model entries */
  ev_inv: {
    [id: string]: boolean
  }

  /** Signals sampled entries were absent or invalidated */
  ev_miss: IdList
};

/**
 * Stores model entries. Allows setting, querying and invalidating model data.
 */
export type Store<F extends Flame> = Node<In<F>, Out<F>>;

/**
 * Creates a Store node.
 */
export function createStore<F extends Flame>(): Store<F> {
  return createNode<In<F>, Out<F>>
  (["d_model", "ev_inv", "ev_miss"], (outputs) => {
    const buffer: Model<F> = {};
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
        const modelOut = <Model<F>>{};
        const missed = [];
        for (let i = 0, count = value.length; i < count; i++) {
          const id = value[i];
          if (id in buffer) {
            modelOut[id] = buffer[id];
            if (id in invalid) {
              missed.push(id);
            }
          } else {
            modelOut[id] = null;
            missed.push(id);
          }
        }
        outputs.d_model(modelOut, tag);
        if (missed.length) {
          outputs.ev_miss(missed, tag);
        }
      },

      d_model: (value, tag) => {
        const bufferDiff = <Model<F>>{};
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
