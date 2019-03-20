import {createNode, Node} from "1e14";
import {FlameDiff} from "gravel-core";
import {applyDomDiff} from "../utils";

export type In = {
  d_diff: FlameDiff;
};

export type Out = {
  b_d_diff: FlameDiff;
};

export type DomDiffApplier = Node<In, Out>;

let instance: DomDiffApplier;

export function createDomDiffApplier(): DomDiffApplier {
  if (instance) {
    return instance;
  }

  instance = createNode<In, Out>(["b_d_diff"], (outputs) => ({
    d_diff: (value, tag) => {
      requestAnimationFrame(() => {
        const bounced = applyDomDiff(value);
        if (bounced !== undefined) {
          outputs.b_d_diff(bounced, tag);
        }
      });
    }
  }));

  return instance;
}
