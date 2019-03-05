import {View} from "gravel-view-dom";
import {createView} from "gravel-view-dom/dist/nodes/View";

export type VmProps = {
  content: string
};

export type TextView = View<VmProps>;

export function createTextView(path: string = ""): TextView {
  return createView<VmProps>(path, {}, (vm) => {
    const vmSet = vm.set;
    return {
      set: {
        innerText: vmSet && vmSet.content
      }
    };
  });
}
