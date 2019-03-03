import {Diff} from "gravel-core";
import {Node} from "river-core";
import {applyDomDiff} from "../utils";

export type In = {
  d_diff: Diff<any>;
};

export type DomDiffApplier = Node<In, {}>;

let instance: DomDiffApplier;

export function createDomDiffApplier(): DomDiffApplier {
  if (instance) {
    return instance;
  }

  const i = {
    d_diff: (value) => {
      requestAnimationFrame(() => applyDomDiff(value));
    }
  };

  instance = {i, o: {}};

  return instance;
}
