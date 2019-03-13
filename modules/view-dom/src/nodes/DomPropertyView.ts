import {replacePathTail} from "gravel-core";
import {createView, ViewIn, ViewOut} from "gravel-view";
import {Any, Node} from "river-core";
import {DomAttributeView} from "./DomAttributeView";

export type In = ViewIn;

export type Out = ViewOut;

export type DomPropertyView = Node<In, Out>;

export function createDomPropertyView(
  path: string,
  tail: string,
  property: string
): DomAttributeView {
  return createView(path, (vm) => {
    const vmSet = vm.set;
    const set: Any = {};
    for (path in vmSet) {
      if (path.endsWith(tail)) {
        set[replacePathTail(path, property)] = vmSet[path];
      }
    }
    const vmDel = vm.del;
    const del: Any = {};
    for (path in vmDel) {
      if (path.endsWith(tail)) {
        del[replacePathTail(path, property)] = null;
      }
    }
    return {set, del};
  });
}
