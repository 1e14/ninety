import {createNoop, Node} from "1e14";
import {ParentViewIn, ParentViewOut} from "./index";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type MainView = Node<In, Out>;

export function createMainView(): MainView {
  const vm = createNoop();
  const view = createNoop();
  return {
    i: {
      d_view: view.i.d_val,
      d_vm: vm.i.d_val
    },
    o: {
      d_view: view.o.d_val,
      d_vm: vm.o.d_val
    }
  };
}
