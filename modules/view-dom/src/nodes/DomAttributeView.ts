import {replacePathTail} from "gravel-core";
import {createView, ViewIn, ViewOut} from "gravel-view";
import {Any, Node} from "river-core";

export type In = ViewIn;

export type Out = ViewOut;

export type DomAttributeView = Node<In, Out>;

export function createDomAttributeView(
  path: string,
  tail: string,
  attribute: string
): DomAttributeView {
  return createView(path, (vm) => {
    const vmSet = vm.set;
    const set: Any = {};
    for (path in vmSet) {
      if (path.endsWith(tail)) {
        set[replacePathTail(path, "attributes." + attribute)] = vmSet[path];
      }
    }
    const vmDel = vm.del;
    const del: Any = {};
    for (path in vmDel) {
      if (path.endsWith(tail)) {
        del[replacePathTail(path, "attributes." + attribute)] = null;
      }
    }
    return {set, del};
  });
}
