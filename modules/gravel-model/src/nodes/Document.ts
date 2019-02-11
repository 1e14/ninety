import {connect, createMerger, INode, TInPorts, TOutPorts} from "@kwaia/mote";
import {TJson} from "../utils";
import {
  createModel,
  IInputs as IModelInputs,
  IOutputs as IModelOutputs
} from "./Model";

export type TInputs<T extends TJson> = T & IModelInputs<T>;

export type TOutputs<T extends TJson> = IModelOutputs<T>;

/**
 * Builds, stores, and maintains a document model.
 */
export type TDocument<D extends TJson> = INode<TInputs<D>, TOutputs<D>>;

export function createDocument<D extends TJson>(fields: Array<keyof D>): TDocument<D> {
  const merger = createMerger<D>(fields);
  const model = createModel<D>();

  connect(merger.o.all, model.i.d_val);

  const i = <TInPorts<TInputs<D>>>{
    ev_smp: model.i.ev_smp,
    st_inv: model.i.st_inv
  };
  for (const field of fields) {
    i[field] = merger.i[field];
  }
  const o = <TOutPorts<TOutputs<D>>>{
    d_val: model.o.d_val,
    ev_inv: model.o.ev_inv
  };

  return {i, o};
}
