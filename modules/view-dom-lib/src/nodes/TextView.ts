import {prefixDiffPaths} from "gravel-core";
import {View, ViewIn, ViewOut} from "gravel-view-dom";
import {createNode} from "river-core";

export type VmProps = {
  content: string
};

export type TextView = View<VmProps>;

export function createTextView(prefix: string = ""): TextView {
  return createNode<ViewIn<VmProps>, ViewOut>(["v_diff"], (outputs) => {
    return {
      v_diff: () => null,

      vm_diff: (value, tag) => {
        outputs.v_diff(prefixDiffPaths({
          set: {
            innerText: value.set.content
          }
        }, prefix), tag);
      }
    };
  });
}
