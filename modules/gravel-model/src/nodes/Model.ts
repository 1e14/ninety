import {createOutPorts, createOutputs, INode, TInPorts} from "@kwaia/mote";
import {TJson} from "../utils";

export interface IInputs<T extends TJson> {
  d_val: T;
  ev_smp: any;
  st_inv: any;
}

export interface IOutputs<T extends TJson> {
  d_val: T;
  ev_inv: boolean;
}

/**
 * Stores model data. Can be invalidated and sampled.
 */
export type TModel<T extends TJson> = INode<IInputs<T>, IOutputs<T>>;

export function createModel<T extends TJson>(): TModel<T> {
  const o = createOutPorts(["d_val", "ev_inv"]);
  const outputs = createOutputs(o);

  let invalidated: boolean;
  let cache: T;

  const i: TInPorts<IInputs<T>> = {
    d_val: (value, tag) => {
      cache = value;
      invalidated = false;
      outputs.d_val(value, tag);
      outputs.ev_inv(invalidated, tag);
    },

    ev_smp: (value, tag) => {
      outputs.d_val(cache, tag);
    },

    st_inv: (value, tag) => {
      invalidated = true;
      outputs.ev_inv(invalidated, tag);
    }
  };

  return {i, o};
}
