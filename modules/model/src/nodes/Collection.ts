import {Diff} from "gravel-types";
import {Any, createNode, Node} from "river-core";
import {diffObjects, mergeObject} from "../callbacks";

export type In<T extends Any> = {
  d_diff: Diff<T>;
  d_val: Partial<T>;
  ev_inv: any;
  ev_smp: any;
};

export type Out<T extends Any> = {
  d_diff: Diff<T>;
  d_val: Partial<T>;
  st_inv: boolean;
};

export type Collection<T extends Any> = Node<In<T>, Out<T>>;

export function createCollection<T extends Any>(): Collection<T> {
  return createNode<In<T>, Out<T>>(["d_diff", "d_val", "st_inv"], (outputs) => {
    let contents = {};
    let invalidated: boolean;

    return {
      d_diff: (value, tag) => {
        if (mergeObject(contents, value)) {
          outputs.d_val(contents, tag);
          outputs.d_diff(value, tag);

          if (invalidated !== false) {
            invalidated = false;
            outputs.st_inv(invalidated, tag);
          }
        }
      },

      d_val: (value, tag) => {
        const diff = value !== contents && diffObjects(contents, value);
        if (diff !== false) {
          contents = value;
          outputs.d_val(contents, tag);
          outputs.d_diff(diff, tag);

          if (invalidated !== false) {
            invalidated = false;
            outputs.st_inv(invalidated, tag);
          }
        }
      },

      ev_inv: (value, tag) => {
        if (invalidated !== true) {
          invalidated = true;
          outputs.st_inv(invalidated, tag);
        }
      },

      ev_smp: (value, tag) => {
        outputs.d_val(contents, tag);
      }
    };
  });
}
