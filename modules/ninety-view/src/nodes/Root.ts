import {createNoop, Node} from "1e14";
import {ParentIn, ParentOut} from "./index";

export type In = ParentIn;

export type Out = ParentOut;

export type Root = Node<In, Out>;

export function createRoot(): Root {
  const vm = createNoop();
  const view = createNoop();
  return {
    i: {
      d_in: vm.i.d_val,
      d_out: view.i.d_val
    },
    o: {
      d_in: vm.o.d_val,
      d_out: view.o.d_val
    }
  };
}
