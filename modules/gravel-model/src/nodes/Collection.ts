import {
  createOutPorts,
  createOutputs,
  INode,
  TInPorts
} from "@protoboard/river";
import {diffObjects, mergeObject} from "../callbacks";
import {IAny, IDiff} from "../utils";

export type TMergerCallback<T extends IAny> =
  (current: Partial<T>, diff: IDiff<T>) => void;

export type TDifferCallback<T extends IAny> =
  (before: Partial<T>, after: Partial<T>) => IDiff<T>;

export interface IInputs<T extends IAny> {
  d_diff: IDiff<T>;
  d_val: Partial<T>;
  ev_inv: any;
  ev_smp: any;
}

export interface IOutputs<T extends IAny> {
  d_diff: IDiff<T>;
  d_val: Partial<T>;
  st_inv: boolean;
}

export type TCollection<T extends IAny> = INode<IInputs<T>, IOutputs<T>>;

export function createCollection<T extends IAny>(): TCollection<T> {
  const o = createOutPorts(["d_diff", "d_val", "st_inv"]);
  const outputs = createOutputs(o);

  let contents = {};
  let invalidated: boolean;

  const i: TInPorts<IInputs<T>> = {
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
