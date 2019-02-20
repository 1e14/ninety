import {createNode, Node} from "river-core";

export type In<V> = {
  d_val: V;
  ev_inv: any;
  ev_smp: any;
};

export type Out<V> = {
  d_val: V;
  st_inv: boolean;
};

export type Field<V> = Node<In<V>, Out<V>>;

export function createField<V>(): Field<V> {
  return createNode<In<V>, Out<V>>
  (["d_val", "st_inv"], (outputs) => {
    let contents: V;
    let invalidated: boolean;

    return {
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
  });
}
