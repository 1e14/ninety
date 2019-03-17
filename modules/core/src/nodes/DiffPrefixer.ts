import {createNode, Node} from "river-core";
import {FlameDiff} from "../types";
import {prefixDiffPaths} from "../utils";

export type In = {
  d_diff: FlameDiff;
};

export type Out = {
  d_diff: FlameDiff;
};

export type DiffPrefixer = Node<In, Out>;

export function createDiffPrefixer(prefix: string): DiffPrefixer {
  return createNode<In, Out>(["d_diff"], (outputs) => {
    return {
      d_diff: (value, tag) => {
        outputs.d_diff(prefixDiffPaths(value, prefix), tag);
      }
    };
  });
}
