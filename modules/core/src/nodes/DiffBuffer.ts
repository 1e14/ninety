import {createNode, Node} from "river-core";
import {FlameDiff} from "../types";
import {compoundDiff} from "../utils";

export type In = {
  d_diff: FlameDiff;
  ev_res: any;
};

export type Out = {
  d_diff: FlameDiff;
};

export type DiffBuffer = Node<In, Out>;

export function createDiffBuffer(buffer = <FlameDiff>{}): DiffBuffer {
  buffer.set = buffer.set || {};
  buffer.del = buffer.del || {};
  let changed = false;

  return createNode<In, Out>
  (["d_diff"], (outputs) => ({
    d_diff: (value) => {
      changed = compoundDiff(value, buffer) || changed;
    },

    ev_res: (value, tag) => {
      if (changed === true) {
        outputs.d_diff(buffer, tag);
        buffer = {
          del: {},
          set: {}
        };
        changed = false;
      }
    }
  }));
}
