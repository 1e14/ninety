import {
  createOutPorts,
  createOutputs,
  INode,
  TInPorts
} from "@protoboard/river";

export interface IInputs<V> {
  d_val: V;
  ev_inv: any;
  ev_smp: any;
}

export interface IOutputs<V> {
  d_val: V;
  st_inv: boolean;
}

export type TField<V> = INode<IInputs<V>, IOutputs<V>>;

export function createField<V>(): TField<V> {
  const o = createOutPorts(["d_val", "st_inv"]);
  const outputs = createOutputs(o);

  let contents: V;
  let invalidated: boolean;

  const i: TInPorts<IInputs<V>> = {
    d_val: (value, tag) => {
      if (value !== contents) {
        contents = value;
        outputs.d_val(value, tag);

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

  return {i, o};
}
