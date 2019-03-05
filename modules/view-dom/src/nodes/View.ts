import {compoundDiff, Diff, prefixDiffPaths} from "gravel-core";
import {Any, createNode, Node} from "river-core";

export type In<T> = {
  v_diff: Diff<any>;
  vm_diff: Diff<T>;
};

export type Out = {
  v_diff: Diff<any>;
};

export type View<T> = Node<In<T>, Out>;

export function createView<T>(
  path: string = "",
  content: Any = {},
  cb?: (vm: Diff<T>) => Diff<any>
): View<T> {
  return createNode<In<T>, Out>(["v_diff"], (outputs) => {
    const diff = {set: content, del: {}};
    return {
      v_diff: (value, tag) => {
        outputs.v_diff(prefixDiffPaths(value, path), tag);
      },

      vm_diff: cb ?
        (value, tag) => {
          const view = cb(value);
          const changed = compoundDiff(view, diff);
          if (changed) {
            outputs.v_diff(prefixDiffPaths(view, path), tag);
          }
        } :
        () => null
    };
  });
}
