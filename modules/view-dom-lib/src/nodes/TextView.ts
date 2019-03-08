import {createView, ViewIn, ViewOut} from "gravel-view";
import {Any, Node} from "river-core";

export type TextVmProps = {
  content: string
};

export type In = ViewIn<TextVmProps>;

export type Out = ViewOut;

export type TextView = Node<In, Out>;

export function createTextView(
  path: string,
  initialVm?: Partial<TextVmProps>
): TextView {
  return createView<TextVmProps>(path, (vm) => {
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
  }, initialVm);
}
