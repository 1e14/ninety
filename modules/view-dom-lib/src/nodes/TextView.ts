import {Diff, prefixDiffPaths} from "gravel-core";
import {createNode, Node} from "river-core";

export type TextViewDiff = Diff<{
  innerText: string
}>;

export type In = {
  vm_content: string;
};

export type Out = {
  v_diff: TextViewDiff;
};

export type TextView = Node<In, Out>;

export function createTextView(prefix: string = ""): TextView {
  return createNode<In, Out>(["v_diff"], (outputs) => {
    return {
      vm_content: (value, tag) => {
        outputs.v_diff(prefixDiffPaths({
          set: {
            innerText: value
          }
        }, prefix), tag);
      }
    };
  });
}
