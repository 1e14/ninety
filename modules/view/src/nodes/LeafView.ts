import {
  applyDiff,
  filterFlameByPrefix,
  Flame,
  FlameDiff,
  replacePathTail2
} from "gravel-core";
import {createNode, Node} from "river-core";
import {PathMapperCallback} from "../types";

export type In = {
  d_vm: FlameDiff;
};

export type Out = {
  d_view: FlameDiff;
  d_vm: FlameDiff;
};

export type LeafView = Node<In, Out>;

// TODO: Is a callback necessary? Are there any other use cases than string?
//  (Perhaps when the property to be written is not known beforehand.)
export function createLeafView(
  cb: PathMapperCallback
): LeafView {
  return createNode<In, Out>
  (["d_view", "d_vm"], (outputs) => ({
    d_vm: (value, tag) => {
      const set = {};
      const del = {};
      const vmSet = value.set;
      const vmDel = value.del;
      for (const abs in vmSet) {
        set[replacePathTail2(abs, cb)] = vmSet[abs];
      }
      for (const abs in vmDel) {
        del[replacePathTail2(abs, cb)] = null;
      }
      outputs.d_view({set, del}, tag);
    }
  }));
}
