import {createNode, Node} from "river-core";
import {Diff} from "../types";

export type In = {
  d_diff: Diff<any>;
};

export type Out = {
  d_diff: Diff<any>;
};

export type DiffPrefixer = Node<In, Out>;

export function createDiffPrefixer(prefix: string): DiffPrefixer {
  return createNode<In, Out>(["d_diff"], (outputs) => {
    return {
      d_diff: (value, tag) => {
        const set = {};
        const del = {};
        const valueSet = value.set;
        if (valueSet) {
          for (const key in valueSet) {
            set[prefix + key] = valueSet[key];
          }
        }
        const valueDel = value.del;
        if (valueDel) {
          for (const key in valueDel) {
            del[prefix + key] = null;
          }
        }
        outputs.d_diff({set, del}, tag);
      }
    };
  });
}
