import {replacePathTail} from "gravel-core";
import {createView, ViewIn, ViewOut} from "gravel-view";
import {Any, Node} from "river-core";

// TODO: Move to TextVm
export type TextVmProps = {
  content: string
};

export type In = ViewIn<Any>;

export type Out = ViewOut;

export type DomTextView = Node<In, Out>;

/**
 * TODO: Change 'content' to 'text'.
 * @param path
 */
export function createDomTextView(
  path: string
): DomTextView {
  return createView<Any>(path, (vm) => {
    const vmSet = vm.set;
    const set: Any = {};
    for (path in vmSet) {
      if (path.endsWith("content")) {
        set[replacePathTail(path, "content", "innerText")] = vmSet[path];
      }
    }
    const vmDel = vm.del;
    const del: Any = {};
    for (path in vmDel) {
      if (path.endsWith("content")) {
        del[replacePathTail(path, "content", "innerText")] = null;
      }
    }
    return {set, del};
  });
}
