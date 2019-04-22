import {createNode, Node} from "1e14";
import {
  countPathComponents,
  Flame,
  replacePathComponent,
  replacePathTail
} from "flamejet";
import {PathMapperCallback} from "../types";

export type In = {
  /** View processed by children */
  d_view: Flame;

  /** View-model passed down by parent */
  d_vm: Flame;
};

export type Out = {
  /** View processed by current node */
  d_view: Flame;

  /** View-model to be passed down to children */
  d_vm: Flame;
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
      const view: Flame = {};
      for (const path in value) {
        if (value[path] === null && countPathComponents(path) === depth + 1) {
          view[replacePathTail(path, cb)] = null;
        }
      }
      for (const path in view) {
        outputs.d_view(view, tag);
        break;
      }
    },

    d_view: (value, tag) => {
      const view = {};
      for (const path in value) {
        view[replacePathComponent(path, depth, cb)] = value[path];
      }
      outputs.d_view(view, tag);
    }
  }));
}
