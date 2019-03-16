import {
  applyDiff,
  filterFlameByPrefix,
  Flame,
  FlameDiff,
  FlameGet,
  replacePathTail2
} from "gravel-core";
import {createNode, Node} from "river-core";

export type PathMapperCallback = (path: string) => string;

export type In = {
  d_vm: FlameDiff | FlameGet;
};

export type Out = {
  d_view: FlameDiff;
  d_vm: FlameDiff;
};

export type LeafView = Node<In, Out>;

// TODO: Is a callback necessary? Are there any other use cases than string?
//  (Perhaps when the property to be written is not known beforehand.)
export function createLeafView(
  cb: PathMapperCallback
): LeafView {
  const cache: Flame = {};
  return createNode<In, Out>
  (["d_view", "d_vm"], (outputs) => ({
    d_vm: (value, tag) => {
      if ("get" in value) {
        // TODO: Handle invalidated state
        // TODO: Investigate performance impact of filterFlameByPrefix()

        // finding matching path-value pairs in cache
        const matches = filterFlameByPrefix(cache, value.get);
        if (matches) {
          // preparing matching path-value pairs for view
          const set = {};
          for (const abs in matches) {
            set[replacePathTail2(abs, cb)] = matches[abs];
          }
          outputs.d_view({set, del: {}}, tag);
        }
      } else {
        const set = {};
        const del = {};
        const vmSet = value.set;
        const vmDel = value.del;
        for (const abs in vmSet) {
          set[replacePathTail2(abs, cb)] = vmSet[abs];
        }
        for (const abs in vmDel) {
          del[replacePathTail2(abs, cb)] = null;
        }
        const changed = applyDiff(value, cache);
        if (changed) {
          outputs.d_view({set, del}, tag);
        }
      }
    }
  }));
}
