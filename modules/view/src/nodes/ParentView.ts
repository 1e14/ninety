import {
  countPathComponents,
  FlameDiff,
  replacePathComponent,
  replacePathTail2
} from "gravel-core";
import {createNode, Node} from "river-core";

export type PathMapperCallback = (path: string) => string;

export type In = {
  d_view: FlameDiff;
  d_vm: FlameDiff;
};

export type Out = {
  d_view: FlameDiff;
  d_vm: FlameDiff;
};

export type ParentView = Node<In, Out>;

export function createParentView(
  cb: PathMapperCallback,
  depth: number = 0
): ParentView {
  return createNode<In, Out>(["d_view", "d_vm"], (outputs) => ({
    d_vm: (value, tag) => {
      // TODO: Handle invalidated state
      // passing VM on towards children
      // (must be split up before children get its contents)
      outputs.d_vm(value, tag);
    },

    d_view: (value, tag) => {
      const set = {};
      const del = {};
      const viewSet = value.set;
      const viewDel = value.del;
      for (const abs in viewSet) {
        set[replacePathComponent(abs, depth, cb)] = viewSet[abs];
      }
      for (const abs in viewDel) {
        del[replacePathComponent(abs, depth, cb)] = null;
      }
      outputs.d_view({set, del}, tag);
    }
  }));
}
