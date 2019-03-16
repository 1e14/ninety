import {
  applyDiff,
  filterFlame,
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
  cb: PathMapperCallback,
  depth: number
): LeafView {
  const cache: Flame = {};
  return createNode<In, Out>(["d_view", "d_vm"], (outputs) => ({
    d_vm: (value, tag) => {
      if ("get" in value) {
        // TODO: Handle invalidated state
        outputs.d_vm({set: filterFlame(cache, value.get), del: {}}, tag);
      } else {
        const result = {set: {}, del: {}};
        for (const abs in value.set) {
          const abs2 = replacePathTail2(abs, depth, cb);
          result.set[abs2] = value.set[abs];
        }
        for (const abs in value.del) {
          const abs2 = replacePathTail2(abs, depth, cb);
          result.del[abs2] = null;
        }
        const changed = applyDiff(value, cache);
        if (changed) {
          outputs.d_view(result, tag);
        }
      }
    }
  }));
}
