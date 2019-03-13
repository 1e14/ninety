import {compoundDiff, Diff, prefixDiffPaths} from "gravel-core";
import {Any, createNode, Node} from "river-core";

export type In = {
  ev_smp: any,
  v_diff: Diff<Any>;
  vm_diff: Diff<Any>;
};

export type Out = {
  ev_smp: any;
  v_diff: Diff<Any>;
};

export type View = Node<In, Out>;

export function createView(
  path: string,
  cb: (vm: Diff<Any>) => Diff<Any>
): View {
  return createNode<In, Out>(["ev_smp", "v_diff"], (outputs) => {
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

      vm_diff: (value, tag) => {
        const view = prefixDiffPaths(cb(value), path);
        const changed = compoundDiff(view, content);
        if (changed) {
          outputs.v_diff(view, tag);
        }
      }
    };
  });
}
