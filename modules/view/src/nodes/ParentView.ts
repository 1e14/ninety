import {
  countPathComponents,
  Flame,
  FlameDiff,
  replacePathComponent,
  replacePathTail
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

      // bouncing subtree delete paths
      let del: Flame;
      for (const path in value.del) {
        if (countPathComponents(path) === depth + 1) {
          del = del || {};
          del[replacePathTail(path, cb)] = null;
        }
      }
      if (del) {
        outputs.d_view({set: {}, del}, tag);
      }
    },

    d_view: (value, tag) => {
      const set = {};
      const del = {};
      const viewSet = value.set;
      const viewDel = value.del;
      for (const path in viewSet) {
        set[replacePathComponent(path, depth, cb)] = viewSet[path];
      }
      for (const path in viewDel) {
        del[replacePathComponent(path, depth, cb)] = null;
      }
      outputs.d_view({set, del}, tag);
    }
  }));
}
