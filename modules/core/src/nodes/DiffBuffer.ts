import {createNode, Node} from "river-core";
import {Diff} from "../types";

export type In<T> = {
  d_diff: Diff<T>;
  st_open: boolean;
};

export type Out<T> = {
  d_diff: Diff<T>;
};

export type DiffBuffer<T> = Node<In<T>, Out<T>>;

export function createDiffBuffer<T>(open?: boolean): DiffBuffer<T> {
  return createNode<In<T>, Out<T>>
  (["d_diff"], (outputs) => {
    let buffer: Diff<T> = {
      del: {},
      set: {}
    };

    return {
      d_diff: (value, tag) => {
        if (open) {
          outputs.d_diff(value, tag);
        } else {
          const bufferSet = buffer.set;
          const bufferDel = buffer.del;

          // transferring deletes
          for (const path in value.del) {
            if (path in bufferSet) {
              delete bufferSet[path];
            } else {
              bufferDel[path] = null;
            }
          }

          // transferring sets
          const valueSet = value.set;
          for (const path in value.set) {
            if (path in bufferDel) {
              delete bufferDel[path];
            } else {
              bufferSet[path] = valueSet[path];
            }
          }
        }
      },

      st_open: (value, tag) => {
        if (value && !open) {
          outputs.d_diff(buffer, tag);
          buffer = {
            del: {},
            set: {}
          };
        }
        open = value;
      }
    };
  });
}
