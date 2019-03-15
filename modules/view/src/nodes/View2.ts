import {Diff, replacePathComponent} from "gravel-core";
import {Any, createNode, Node} from "river-core";

export type PathMapperCallback = (path: string) => string;

export type In = {
  v_diff: Diff<Any>;
};

export type Out = {
  v_diff: Diff<Any>;
};

export type View2 = Node<In, Out>;

export function createView2(
  cb?: PathMapperCallback,
  depth: number = 0
): View2 {
  return createNode<In, Out>(["v_diff"], (outputs) => ({
    v_diff: (value, tag) => {
      const result = {set: {}, del: {}};
      for (const abs in value.set) {
        const abs2 = replacePathComponent(abs, depth, cb);
        result.set[abs2] = value.set[abs];
      }
      for (const abs in value.del) {
        const abs2 = replacePathComponent(abs, depth, cb);
        result.del[abs2] = null;
      }
      outputs.v_diff(result, tag);
    }
  }));
}
