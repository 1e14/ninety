import {Diff} from "gravel-core";
import {Any, createNode, Node} from "river-core";
import {applyDomDiff} from "../utils";

export type In = {
  d_diff: Diff<Any>;
};

export type Out = {
  b_d_diff: Diff<Any>;
};

export type DomDiffApplier = Node<In, Out>;

let instance: DomDiffApplier;

export function createDomDiffApplier(): DomDiffApplier {
  if (instance) {
    return instance;
  }

  instance = createNode<In, Out>(["b_d_diff"], (outputs) => {
    return {
      d_diff: (value, tag) => {
        requestAnimationFrame(() => {
          const applied = applyDomDiff(value);
          if (applied !== true) {
            outputs.b_d_diff(applied, tag);
          }
        });
      }
    };
  });

  return instance;
}
