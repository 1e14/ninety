import {createNode, Node} from "1e14";
import {Flame} from "../types";

export type In = {
  /** Flame to be stored. */
  d_val: Flame;
};

export type Out = {
  /** Flame filtered by existing content. */
  d_val: Flame;
};

/**
 * Stores flame data. Immediately emits diff on every input.
 */
export type FlameStore = Node<In, Out>;

/**
 * Creates a FlameStore node.
 */
export function createFlameStore(): FlameStore {
  return createNode<In, Out>(["d_val"], (outputs) => {
    const buffer: Map<string, string> = new Map();
    return {
      d_val: (value, tag) => {
        const flame = {};
        for (const path in value) {
          const property = value[path];
          if (property === null) {
            if (buffer.has(path)) {
              buffer.delete(path);
              flame[path] = null;
            }
          } else if (property !== buffer.get(path)) {
            buffer.set(path, property);
            flame[path] = property;
          }
        }
        outputs.d_val(flame, tag);
      }
    };
  });
}
