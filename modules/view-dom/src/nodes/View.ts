import {compoundDiff, Diff, prefixDiffPaths} from "gravel-core";
import {Any, createNode, Node} from "river-core";

export type In<T> = {
  ev_smp: any,
  v_diff: Diff<Any>;
  vm_diff: Diff<T>;
};

export type Out = {
  ev_smp: any;
  v_diff: Diff<Any>;
};

export type View<T> = Node<In<T>, Out>;

export function createView<T>(
  path: string = "",
  cb?: (vm: Diff<T>) => Diff<Any>
): View<T> {
  return createNode<In<T>, Out>(["ev_smp", "v_diff"], (outputs) => {
    const content = {set: {}, del: {}};
    return {
      ev_smp: (value, tag) => {
        outputs.v_diff({
          del: {[path]: null},
          set: content.set
        }, tag);
        outputs.ev_smp(value, tag);
      },

      v_diff: (value, tag) => {
        outputs.v_diff(prefixDiffPaths(value, path), tag);
      },

      vm_diff: cb ?
        (value, tag) => {
          const view = prefixDiffPaths(cb(value), path);
          const changed = compoundDiff(view, content);
          if (changed) {
            outputs.v_diff(view, tag);
          }
        } :
        () => null
    };
  });
}
