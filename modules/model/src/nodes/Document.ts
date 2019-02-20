import {InPorts, Node, OutPorts} from "river-core";
import {createNoop} from "river-stdlib";

export type In = {
  ev_inv: any;
  ev_smp: any;
};

export type Out = {
  ev_inv: any;
  ev_smp: any;
};

export type Document = Node<In, Out>;

export function createDocument(): Document {
  const invalidator = createNoop();
  const sampler = createNoop();

  const i: InPorts<In> = {
    ev_inv: invalidator.i.d_val,
    ev_smp: sampler.i.d_val
  };

  const o: OutPorts<Out> = {
    ev_inv: invalidator.o.d_val,
    ev_smp: sampler.o.d_val
  };

  return {i, o};
}
