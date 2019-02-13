import {connect, createMerger, INode, TInPorts, TOutPorts} from "@protoboard/river";
import {TJson} from "../utils";
import {
  createStore,
  IInputs as IModelInputs,
  IOutputs as IModelOutputs
} from "./Store";

export type TInputs<T extends TJson> = T & IModelInputs<T>;

export type TOutputs<T extends TJson> = IModelOutputs<T>;

/**
 * Stores and updates a document model.
 */
export type TDocument<D extends TJson> = INode<TInputs<D>, TOutputs<D>>;

export function createDocument<D extends TJson>(fields: Array<keyof D>): TDocument<D> {
  const merger = createMerger<D>(fields);
  const model = createStore<D>();

  connect(merger.o.all, model.i.d_val);

  const i = <TInPorts<TInputs<D>>>{
    ev_inv: model.i.ev_inv,
    ev_smp: model.i.ev_smp
  };
  for (const field of fields) {
    i[field] = merger.i[field];
  }
  const o = <TOutPorts<TOutputs<D>>>{
    d_val: model.o.d_val,
    st_inv: model.o.st_inv
  };

  return {i, o};
}
