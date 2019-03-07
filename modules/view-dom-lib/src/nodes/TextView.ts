import {createView, ViewIn, ViewOut} from "gravel-view-dom";
import {Any, Node} from "river-core";

export type VmProps = {
  content: string
};

export type In = ViewIn<VmProps>;

export type Out = ViewOut;

export type TextView = Node<In, Out>;

export function createTextView(
  path: string
): TextView {
  return createView<VmProps>(path, (vm) => {
    const vmSet = vm.set;
    const vmDel = vm.del;
    const set: Any = {};
    const del: Any = {};
    if ("content" in vmSet) {
      set.innerText = vmSet.content;
    } else if ("content" in vmDel) {
      del.innerText = null;
    }
    return {set, del};
  });
}
