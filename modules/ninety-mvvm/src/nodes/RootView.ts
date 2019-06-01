import {createFlameMapperRoot} from "flamejet";
import {Node} from "flowcode";
import {ParentViewIn, ParentViewOut} from "./index";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type RootView = Node<In, Out>;

export function createRootView(): RootView {
  const flameMapperRoot = createFlameMapperRoot();
  return {
    i: {
      d_view: flameMapperRoot.i.d_out,
      d_vm: flameMapperRoot.i.d_in
    },
    o: {
      d_view: flameMapperRoot.o.d_out,
      d_vm: flameMapperRoot.o.d_in
    }
  };
}
