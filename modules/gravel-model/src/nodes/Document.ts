import {INode, TInPorts, TOutPorts} from "@protoboard/river";
import {createNoop} from "@protoboard/river-stdlib";

export interface IInputs {
  ev_inv: any;
  ev_smp: any;
}

export interface IOutputs {
  ev_inv: any;
  ev_smp: any;
}

export type TDocument = INode<IInputs, IOutputs>;

export function createDocument(): TDocument {
  const invalidator = createNoop();
  const sampler = createNoop();

  const i: TInPorts<IInputs> = {
    ev_inv: invalidator.i.d_val,
    ev_smp: sampler.i.d_val
  };

  const o: TOutPorts<IOutputs> = {
    ev_inv: invalidator.o.d_val,
    ev_smp: sampler.o.d_val
  };

  return {i, o};
}
