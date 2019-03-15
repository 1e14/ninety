import {applyDiff, Diff, filterLookup, replacePathTail2} from "gravel-core";
import {Any, createNode, Node} from "river-core";

export type PathMapperCallback = (path: string) => string;

export type In = {
  ev_smp: Any;
  vm_diff: Diff<Any>;
};

export type Out = {
  v_diff: Diff<Any>;
};

export type LeafView = Node<In, Out>;

// TODO: Is a callback necessary? Are there any other use cases than string?
//  (Perhaps when the property to be written is not known beforehand.)
export function createLeafView(
  cb: PathMapperCallback,
  depth: number = 0
): LeafView {
  const cache: Any = {};
  return createNode<In, Out>(["v_diff"], (outputs) => ({
    ev_smp: (value, tag) => {
      const filtered = filterLookup(cache, value);
      if (filtered) {
        outputs.v_diff({
          del: {},
          set: filtered
        }, tag);
      }
    },

    vm_diff: (value, tag) => {
      const changed = applyDiff(value, cache);
      if (changed) {
        const result = {set: {}, del: {}};
        for (const abs in value.set) {
          const abs2 = replacePathTail2(abs, depth, cb);
          result.set[abs2] = value.set[abs];
        }
        for (const abs in value.del) {
          const abs2 = replacePathTail2(abs, depth, cb);
          result.del[abs2] = null;
        }
        outputs.v_diff(result, tag);
      }
    }
  }));
}
