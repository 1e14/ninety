import {createOutPorts, createOutputs, InPorts, Node} from "river-core";

export type Inputs<V> = {
  d_val: V;
  ev_inv: any;
  ev_smp: any;
};

export type Outputs<V> = {
  d_val: V;
  st_inv: boolean;
};

export type Field<V> = Node<Inputs<V>, Outputs<V>>;

export function createField<V>(): Field<V> {
  const o = createOutPorts(["d_val", "st_inv"]);
  const outputs = createOutputs(o);

  let contents: V;
  let invalidated: boolean;

  const i: InPorts<Inputs<V>> = {
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
