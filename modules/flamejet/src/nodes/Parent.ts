import {createNode, Node} from "1e14";
import {Flame, PathMapperCallback} from "../types";
import {
  countPathComponents,
  replacePathComponent,
  replacePathTail
} from "../utils";

export type In = {
  /** View processed by children */
  d_out: Flame;

  /** View-model passed down by parent */
  d_in: Flame;
};

export type Out = {
  /** View processed by current node */
  d_out: Flame;

  /** View-model to be passed down to children */
  d_in: Flame;
};

/**
 * Processes the view of a non-leaf component in the component tree.
 * Child views of a Parent must connect to its output 'd_in' and input
 * 'd_out' ports in order to work.
 * Passes received view-model on to children without change. (Distribution
 * phase)
 * Processes view received from children and passes it on to prent.
 * (Bubbling phase)
 */
export type Parent = Node<In, Out>;

/**
 * Creates a Parent node.
 * @param cb Maps view-model path component to view path component.
 * @param depth Specifies location in the component tree.
 */
export function createParent(
  cb: PathMapperCallback,
  depth: number = 0
): Parent {
  return createNode<In, Out>(["d_out", "d_in"], (outputs) => ({
    d_in: (value, tag) => {
      // passing VM on towards children
      // (must be split up before children get its contents)
      outputs.d_in(value, tag);

      // bouncing subtree delete paths
      const view: Flame = {};
      for (const path in value) {
        if (value[path] === null && countPathComponents(path) === depth + 1) {
          view[replacePathTail(path, cb)] = null;
        }
      }
      for (const path in view) {
        outputs.d_out(view, tag);
        break;
      }
    },

    d_out: (value, tag) => {
      const view = {};
      for (const path in value) {
        view[replacePathComponent(path, depth, cb)] = value[path];
      }
      outputs.d_out(view, tag);
    }
  }));
}
