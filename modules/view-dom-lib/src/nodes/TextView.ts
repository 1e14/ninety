import {Diff, prefixDiffPaths} from "gravel-core";
import {createNode, Node} from "river-core";

export type In = {
  d_content: string;
};

export type Out = {
  d_diff: Diff<{
    innerText: string
  }>
};

export type TextView = Node<In, Out>;

export function createTextView(): TextView {
  return createNode<In, Out>(["d_diff"], (outputs) => {
    return {
      d_content: (value, tag) => {
        outputs.d_diff(prefixDiffPaths({
          set: {
            innerText: value
          }
        }, ":span."), tag);
      }
    };
  });
}
