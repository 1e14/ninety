import {createNode, Node} from "1e14";
import {Flame, replacePathTail} from "flamejet";
import {PathMapperCallback} from "../types";

export type In = {
  d_in: Flame;
};

export type Out = {
  d_out: Flame;
};

export type Leaf = Node<In, Out>;

// TODO: Is a callback necessary? Are there any other use cases than string?
//  (Perhaps when the property to be written is not known beforehand.)
export function createLeaf(
  cb: PathMapperCallback
): Leaf {
  return createNode<In, Out>
  (["d_out"], (outputs) => ({
    d_in: (value, tag) => {
      const view = {};
      for (const abs in value) {
        view[replacePathTail(abs, cb)] = value[abs];
      }
      outputs.d_out(view, tag);
    }
  }));
}
