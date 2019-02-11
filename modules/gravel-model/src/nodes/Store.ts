import {createOutPorts, createOutputs, INode, TInPorts} from "@kwaia/mote";
import {IDiff, TJson} from "../utils";

export type TMergerCallback<T extends TJson> =
  (current: Partial<T>, diff: IDiff<T>) => void;

export type TDifferCallback<T extends TJson> =
  (before: Partial<T>, after: Partial<T>) => IDiff<T>;

export interface IInputs<T extends TJson> {
  /** Diff to be applied to store contents. */
  d_diff: IDiff<T>;

  /** Value to replace store contents. */
  d_val: Partial<T>;

  /** Sets invalidated state (to true). */
  ev_inv: any;

  /** Samples current store contents. */
  ev_smp: any;
}

export interface IOutputs<T extends TJson> {
  /** Bounced diff. */
  b_d_diff: IDiff<T>;

  /** Diff applied to store contents. */
  d_diff: IDiff<T>;

  /** Bounced value. */
  b_d_val: Partial<T>;

  /** New store contents. */
  d_val: Partial<T>;

  /** Error message. */
  ev_err: string;

  /** Invalidity state. */
  st_inv: boolean;
}

/**
 * Stores model data. Can be invalidated and sampled.
 */
export type TStore<T extends TJson> = INode<IInputs<T>, IOutputs<T>>;

/**
 * Creates a TStore node.
 * @param merger Merges diff with store contents.
 * @param differ Generates diff from two different store contents.
 * @param contents Initial contents.
 */
export function createStore<T extends TJson>(
  merger?: TMergerCallback<T>,
  differ?: TDifferCallback<T>,
  contents?: Partial<T>
): TStore<T> {
  const o = createOutPorts(["b_d_diff", "b_d_val", "d_diff", "d_val", "ev_err", "st_inv"]);
  const outputs = createOutputs(o);

  let invalidated: boolean;

  const i: TInPorts<IInputs<T>> = {
    d_diff: merger ?
      (value, tag) => {
        try {
          merger(contents, value);
          invalidated = false;
          outputs.d_val(contents, tag);
          outputs.d_diff(value, tag);
        } catch (err) {
          outputs.b_d_diff(value, tag);
          outputs.ev_err(String(err), tag);
        }
      } :
      (value, tag) => {
        outputs.b_d_diff(value, tag);
        const message = "No merger callback. Can't merge.";
        outputs.ev_err(String(new Error(message)), tag);
      },

    d_val: differ ?
      (value, tag) => {
        const before = contents;
        contents = value;
        invalidated = false;
        try {
          outputs.d_diff(differ(before, value), tag);
        } catch (err) {
          outputs.b_d_val(value, tag);
          outputs.ev_err(String(err), tag);
        }
        outputs.d_val(value, tag);
        outputs.st_inv(invalidated, tag);
      } :
      (value, tag) => {
        contents = value;
        invalidated = false;
        outputs.d_val(value, tag);
        outputs.st_inv(invalidated, tag);
      },

    ev_inv: (value, tag) => {
      invalidated = true;
      outputs.st_inv(invalidated, tag);
    },

    ev_smp: (value, tag) => {
      outputs.d_val(contents, tag);
    }
  };

  return {i, o};
}
