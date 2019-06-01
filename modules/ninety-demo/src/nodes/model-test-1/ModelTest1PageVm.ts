import {connect, Node} from "flowcode";
import {createMapper} from "flowcode-fp";
import {ParentVmIn, ParentVmOut} from "ninety-mvvm";
import {createParentVm} from "ninety-mvvm/dist";

export type In = ParentVmIn & {
  ev_ready: any;
};

export type Out = ParentVmOut;

export type ModelTest1PageVm = Node<In, Out>;

export function createModelTest1PageVm(
  path: string,
  depth: number = 0
): ModelTest1PageVm {
  const vm = createParentVm(() => path, depth);
  const staticVm = createMapper(() => ({
    "page": null,
    "page.desc.text": "List items with references"
  }));

  connect(staticVm.o.d_val, vm.i.d_vm);

  return {
    i: {
      d_model: vm.i.d_model,
      d_vm: vm.i.d_vm,
      ev_ready: staticVm.i.d_val
    },
    o: {
      d_model: vm.o.d_model,
      d_vm: vm.o.d_vm
    }
  };
}
