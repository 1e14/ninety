import {replacePathTail} from "gravel-core";
import {createView, ViewIn, ViewOut} from "gravel-view";
import {Any, Node} from "river-core";
import {DomAttributeView} from "./DomAttributeView";

export type In = ViewIn<Any>;

export type Out = ViewOut;

export type DomStyleView = Node<In, Out>;

export function createDomStyleView(
  path: string,
  tail: string,
  cssClass: string,
  initialVm?: Any
): DomAttributeView {
  return createView(path, (vm) => {
    const vmSet = vm.set;
    const set: Any = {};
    for (path in vmSet) {
      if (path.endsWith(tail)) {
        set[replacePathTail(path, tail, "style." + cssClass)] = vmSet[path];
      }
    }
    const vmDel = vm.del;
    const del: Any = {};
    for (path in vmDel) {
      if (path.endsWith(tail)) {
        del[replacePathTail(path, tail, "style." + cssClass)] = null;
      }
    }
    return {set, del};
  }, initialVm);
}
