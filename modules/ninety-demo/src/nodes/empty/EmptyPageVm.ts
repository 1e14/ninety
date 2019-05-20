import {Node} from "1e14";
import {createMapper} from "1e14-fp";
import {LeafVmIn, LeafVmOut} from "ninety-mvvm";

export type In = LeafVmIn & {
  ev_ready: any
};

export type Out = LeafVmOut;

export type EmptyPageVm = Node<In, Out>;

export function createEmptyPageVm(): EmptyPageVm {
  const staticVm = createMapper(() => ({
    page: null
  }));

  return {
    i: {
      d_model: null,
      ev_ready: staticVm.i.d_val
    },
    o: {
      d_vm: staticVm.o.d_val
    }
  };
}
