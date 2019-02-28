import {Diff} from "gravel-types";
import {prependPaths} from "gravel-view-dom";
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
        outputs.d_diff(prependPaths({
          del: {},
          set: {
            innerText: value
          }
        }, ":span."), tag);
      }
    };
  });
}
