import {createView, ViewIn, ViewOut} from "gravel-view";
import {Any, Node} from "river-core";

export type LinkVmProps = {
  url: string;
  content: string;
};

export type In = ViewIn<LinkVmProps>;

export type Out = ViewOut;

export type LinkView = Node<In, Out>;

export function createLinkView(
  path: string,
  initialVm?: Partial<LinkVmProps>
): LinkView {
  return createView<LinkVmProps>(path, (vm) => {
    const vmSet = vm.set;
    const vmDel = vm.del;
    const set: Any = {};
    const del: Any = {};
    if ("url" in vmSet) {
      set.href = vmSet.url;
    }
    if ("content" in vmSet) {
      set.innerText = vmSet.content;
    }
    if ("url" in vmDel) {
      del.href = vmDel.url;
    }
    if ("content" in vmDel) {
      del.innerText = vmDel.content;
    }
    return {set, del};
  }, initialVm);
}
