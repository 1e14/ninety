import {Node} from "1e14";
import {createMapper} from "1e14-fp";
import {LeafVmIn, LeafVmOut} from "ninety-mvvm";

export type In = LeafVmIn;

export type Out = LeafVmOut;

export type HelloWorldPageVm = Node<In, Out>;

export function createHelloWorldPageVm(): HelloWorldPageVm {
  const staticVm = createMapper(() => ({
    "page": null,
    "page.caption.text": "Hello World!"
  }));

  return {
    i: {
      d_model: staticVm.i.d_val
    },
    o: {
      d_vm: staticVm.o.d_val
    }
  };
}
