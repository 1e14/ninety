import {
  Any,
  createOutPorts,
  createOutputs,
  InPorts,
  Node
} from "@protoboard/river";
import {diffObjects, mergeObject} from "../callbacks";
import {Diff} from "../types";

export type Inputs<T extends Any> = {
  d_diff: Diff<T>;
  d_val: Partial<T>;
  ev_inv: any;
  ev_smp: any;
};

export type Outputs<T extends Any> = {
  d_diff: Diff<T>;
  d_val: Partial<T>;
  st_inv: boolean;
};

export type Collection<T extends Any> = Node<Inputs<T>, Outputs<T>>;

export function createCollection<T extends Any>(): Collection<T> {
  const o = createOutPorts(["d_diff", "d_val", "st_inv"]);
  const outputs = createOutputs(o);

  let contents = {};
  let invalidated: boolean;

  const i: InPorts<Inputs<T>> = {
    d_diff: (value, tag) => {
      if (value.set.length || value.del.length) {
        mergeObject(contents, value);
        outputs.d_val(contents, tag);
        outputs.d_diff(value, tag);

        if (invalidated !== false) {
          invalidated = false;
          outputs.st_inv(invalidated, tag);
        }
      }
    },

    d_val: (value, tag) => {
      if (value !== contents) {
        const diff = diffObjects(contents, value);
        if (diff.set.length || diff.del.length) {
          contents = value;
          outputs.d_val(contents, tag);
          outputs.d_diff(diff, tag);

          if (invalidated !== false) {
            invalidated = false;
            outputs.st_inv(invalidated, tag);
          }
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

  return {i, o};
}
