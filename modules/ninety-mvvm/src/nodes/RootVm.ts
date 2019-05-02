import {Node} from "1e14";
import {createFlameMapperRoot} from "flamejet";
import {ParentVmIn, ParentVmOut} from "./index";

export type In = ParentVmIn;

export type Out = ParentVmOut;

export type RootVm = Node<In, Out>;

export function createRootVm(): RootVm {
  const flameMapperRoot = createFlameMapperRoot();
  return {
    i: {
      d_model: flameMapperRoot.i.d_in,
      d_vm: flameMapperRoot.i.d_out
    },
    o: {
      d_model: flameMapperRoot.o.d_in,
      d_vm: flameMapperRoot.o.d_out
    }
  };
}
