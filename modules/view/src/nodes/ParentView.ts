import {FlameDiff, FlameGet, replacePathComponent} from "gravel-core";
import {createNode, Node} from "river-core";

export type PathMapperCallback = (path: string) => string;

export type In = {
  d_view: FlameDiff;
  d_vm: FlameDiff | FlameGet;
};

export type Out = {
  d_view: FlameDiff;
  d_vm: FlameDiff | FlameGet;
};

export type ParentView = Node<In, Out>;

export function createParentView(
  cb: PathMapperCallback,
  depth: number = 0
): ParentView {
  return createNode<In, Out>(["d_view", "d_vm"], (outputs) => ({
    d_vm: (value, tag) => {
      // TODO: Handle invalidated state
      outputs.d_vm(value, tag);
    },

    d_view: (value, tag) => {
      const result = {set: {}, del: {}};
      for (const abs in value.set) {
        const abs2 = replacePathComponent(abs, depth, cb);
        result.set[abs2] = value.set[abs];
      }
      for (const abs in value.del) {
        const abs2 = replacePathComponent(abs, depth, cb);
        result.del[abs2] = null;
      }
      outputs.d_view(result, tag);
    }
  }));
}
