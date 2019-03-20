import {createNode, Node} from "1e14";
import {
  countPathComponents,
  Flame,
  FlameDiff,
  replacePathComponent,
  replacePathTail
} from "gravel-core";

export type PathMapperCallback = (path: string) => string;

export type In = {
  /** View diff processed by children */
  d_view: FlameDiff;

  /** View-model diff passed down by parent */
  d_vm: FlameDiff;
};

export type Out = {
  /** View diff processed by current node */
  d_view: FlameDiff;

  /** View-model diff to be passed down to children */
  d_vm: FlameDiff;
};

/**
 * Processes the view of a non-leaf component in the component tree.
 * Child views of a ParentView must connect to its output 'd_vm' and input
 * 'd_view' ports in order to work.
 * Passes received view-model on to children without change. (Distribution
 * phase)
 * Processes view received from children and passes it on to prent.
 * (Bubbling phase)
 */
export type ParentView = Node<In, Out>;

/**
 * Creates a ParentView node.
 * @param cb Maps view-model path component to view path component.
 * @param depth Specifies location in the component tree.
 */
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
