import {createNode, Node} from "1e14";
import {FlameDiff, replacePathTail} from "flamejet";
import {PathMapperCallback} from "../types";

export type In = {
  d_vm: FlameDiff;
};

export type Out = {
  d_view: FlameDiff;
};

export type LeafView = Node<In, Out>;

// TODO: Is a callback necessary? Are there any other use cases than string?
//  (Perhaps when the property to be written is not known beforehand.)
export function createLeafView(
  cb: PathMapperCallback
): LeafView {
  return createNode<In, Out>
  (["d_view"], (outputs) => ({
    d_vm: (value, tag) => {
      const set = {};
      const del = {};
      const vmSet = value.set;
      const vmDel = value.del;
      for (const abs in vmSet) {
        set[replacePathTail(abs, cb)] = vmSet[abs];
      }
      for (const abs in vmDel) {
        del[replacePathTail(abs, cb)] = null;
      }
      outputs.d_view({set, del}, tag);
    }
  }));
}
