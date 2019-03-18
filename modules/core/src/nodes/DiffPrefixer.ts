import {createNode, Node} from "river-core";
import {Flames} from "../types";
import {prefixFlamePaths} from "../utils";

export type In = {
  d_diff: Flames;
};

export type Out = {
  d_diff: Flames;
};

export type DiffPrefixer = Node<In, Out>;

/**
 * TODO: Remove? Not used anywhere.
 * @deprecated Not used anywhere.
 * @param prefix
 */
export function createDiffPrefixer(prefix: string): DiffPrefixer {
  return createNode<In, Out>(["d_diff"], (outputs) => {
    return {
      d_diff: (value, tag) => {
        outputs.d_diff(prefixFlamePaths(value, prefix), tag);
      }
    };
  });
}
