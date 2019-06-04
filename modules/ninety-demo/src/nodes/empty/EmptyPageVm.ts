import {Node} from "flowcode";
import {createMapper} from "flowcode-fp";
import {LeafVmIn, LeafVmOut} from "ninety-mvvm";

export type In = LeafVmIn & {
  a_stat: any
};

export type Out = LeafVmOut;

export type EmptyPageVm = Node<In, Out>;

export function createEmptyPageVm(): EmptyPageVm {
  const staticVm = createMapper(() => ({
    page: null
  }));

  return {
    i: {
      a_stat: staticVm.i.d_val,
      d_model: null
    },
    o: {
      d_vm: staticVm.o.d_val
    }
  };
}
