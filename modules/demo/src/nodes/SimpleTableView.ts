import {createView, ViewIn, ViewOut} from "gravel-view";
import {Any, Node} from "river-core";

export type TableVmProps = Any;

export type In = ViewIn<TableVmProps>;

// TODO: Add error port
export type Out = ViewOut;

export type SimpleTableView = Node<In, Out>;

const RE_VM_PATH = /^(\d+)\.(\d+)$/;

export function createSimpleTableView(
  path: string = "",
  initialVm?: TableVmProps
) {
  return createView<TableVmProps>(path, (vm) => {
    const vmSet = vm.set;
    const vmDel = vm.del;
    const set = {};
    const del = {};
    for (const key in vmSet) {
      const hits = RE_VM_PATH.exec(key);
      if (hits) {
        const row = hits[1];
        const column = hits[2];
        set[`childNodes.${row}:tr.childNodes.${column}:td.innerText`] = vmSet[key];
      }
    }
    for (const key in vmDel) {
      const hits = RE_VM_PATH.exec(key);
      if (hits) {
        const row = hits[1];
        const column = hits[2];
        del[`childNodes.${row}:tr.childNodes.${column}:td.innerText`] = null;
      }
    }
    return {set, del};
  }, initialVm);
}
