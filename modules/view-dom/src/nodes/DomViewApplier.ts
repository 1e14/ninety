import {Diff} from "gravel-core";
import {Node} from "river-core";
import {applyDomView} from "../utils";

export type In = {
  d_diff: Diff<any>;
};

export type DomViewApplier = Node<In, {}>;

let instance: DomViewApplier;

export function createDomViewApplier(): DomViewApplier {
  if (instance) {
    return instance;
  }

  const i = {
    d_diff: (value) => {
      requestAnimationFrame(() => applyDomView(value));
    }
  };

  instance = {i, o: {}};

  return instance;
}
