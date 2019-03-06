import {createNode, Node} from "river-core";
import {Diff} from "../types";
import {compoundDiff} from "../utils";

export type In<T> = {
  d_diff: Diff<T>;
  ev_res: any;
};

export type Out<T> = {
  d_diff: Diff<T>;
};

export type DiffBuffer<T> = Node<In<T>, Out<T>>;

export function createDiffBuffer<T>(buffer: Diff<T> = {}): DiffBuffer<T> {
  return createNode<In<T>, Out<T>>
  (["d_diff"], (outputs) => {
    buffer.set = buffer.set || {};
    buffer.del = buffer.del || {};
    let changed = false;

    return {
      d_diff: (value) => {
        changed = compoundDiff(value, buffer) || changed;
      },

      ev_res: (value, tag) => {
        if (changed === true) {
          outputs.d_diff(buffer, tag);
          buffer = {
            del: {},
            set: {}
          };
          changed = false;
        }
      }
    };
  });
}
