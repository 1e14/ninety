import {
  countPathComponents,
  FlameDiff,
  FlameGet,
  replacePathComponent,
  replacePathTail2
} from "gravel-core";
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
      if ("get" in value) {
        // view is about to re-render
        // sending delete diff for entire subtree
        const del = {};
        const vmGet = value.get;
        for (const abs in vmGet) {
          if (countPathComponents(abs) === depth + 1) {
            // applying current view's path component
            // and sending up to parent(s)
            del[replacePathTail2(abs, cb)] = null;
            outputs.d_view({set: {}, del}, tag);
            // the only matching path processed - finishing
            break;
          }
        }
      }

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
