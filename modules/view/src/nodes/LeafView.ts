import {Diff, replacePathTail2} from "gravel-core";
import {Any, createNode, Node} from "river-core";

export type PathMapperCallback = (path: string) => string;

export type In = {
  v_diff: Diff<Any>;
};

export type Out = {
  v_diff: Diff<Any>;
};

export type LeafView = Node<In, Out>;

// TODO: Sampling?
// TODO: Is a callback necessary? Are there any other use cases than string?
//  (Perhaps when the property to be written is not known beforehand.)
export function createLeafView(
  cb: PathMapperCallback,
  depth: number = 0
): LeafView {
  return createNode<In, Out>(["v_diff"], (outputs) => ({
    v_diff: (value, tag) => {
      const result = {set: {}, del: {}};
      for (const abs in value.set) {
        const abs2 = replacePathTail2(abs, depth, cb);
        result.set[abs2] = value.set[abs];
      }
      for (const abs in value.del) {
        const abs2 = replacePathTail2(abs, depth, cb);
        result.del[abs2] = null;
      }
      outputs.v_diff(result, tag);
    }
  }));
}
