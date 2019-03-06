import {createView, ViewIn, ViewOut} from "gravel-view-dom";
import {Node} from "river-core";

export type VmProps = {
  content: string
};

export type In = ViewIn<VmProps>;

export type Out = ViewOut;

export type TextView = Node<In, Out>;

export function createTextView(
  path: string = ""
): TextView {
  return createView<VmProps>(path, (vm) => {
    const set = vm.set;
    return {
      set: {
        innerText: set && set.content
      }
    };
  });
}
