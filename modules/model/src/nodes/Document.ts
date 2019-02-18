import {InPorts, Node, OutPorts} from "river-core";
import {createNoop} from "river-stdlib";

export type Inputs = {
  ev_inv: any;
  ev_smp: any;
};

export type Outputs = {
  ev_inv: any;
  ev_smp: any;
};

export type Document = Node<Inputs, Outputs>;

export function createDocument(): Document {
  const invalidator = createNoop();
  const sampler = createNoop();

  const i: InPorts<Inputs> = {
    ev_inv: invalidator.i.d_val,
    ev_smp: sampler.i.d_val
  };

  const o: OutPorts<Outputs> = {
    ev_inv: invalidator.o.d_val,
    ev_smp: sampler.o.d_val
  };

  return {i, o};
}
