import {createNode, Node} from "1e14";
import {Flame, replacePathTail} from "flamejet";
import {PathMapperCallback} from "../types";

export type In = {
  d_vm: Flame;
};

export type Out = {
  d_view: Flame;
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
      const view = {};
      for (const abs in value) {
        view[replacePathTail(abs, cb)] = value[abs];
      }
      outputs.d_view(view, tag);
    }
  }));
}
