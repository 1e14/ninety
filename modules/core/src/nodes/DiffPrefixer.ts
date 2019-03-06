import {Any, createNode, Node} from "river-core";
import {Diff} from "../types";
import {prefixDiffPaths} from "../utils";

export type In = {
  d_diff: Diff<Any>;
};

export type Out = {
  d_diff: Diff<Any>;
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
