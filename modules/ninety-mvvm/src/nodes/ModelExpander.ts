import {connect, InPorts, Node} from "1e14";
import {createMerger} from "1e14-flow";
import {createMapper} from "1e14-fp";
import {Flame, treeToFlame} from "flamejet";
import {FlamesByModelType, Model, ReferenceConfig} from "../types";
import {expandModel} from "../utils/expandModel";

export type In<T extends FlamesByModelType> = {
  [type in keyof T]: Model<T[type]>
};

export type Out<S extends Flame> = {
  /** Model as consumed by view-model */
  d_model: Model<S>;
};

/**
 * Expands model references into a tree so that it fits the view-model.
 * config must list all expanding references for all affected types.
 */
export type ModelExpander<T extends FlamesByModelType> =
  Node<In<T>, Out<T["d_model"]>>;

/**
 * Creates a ModelExpander node.
 * @param config Defines expanding references.
 * @see ReferenceConfig
 */
export function createModelExpander<T extends FlamesByModelType>(
  config: ReferenceConfig<T>
): ModelExpander<T> {
  // TODO: Should extract port names from values as well
  const inPorts = Object.keys(config);

  const merger = createMerger<In<T>>(inPorts);
  const expander = createMapper<{ d_model: Model<T["d_model"]> }, any>((value) => {
    return expandModel(value, config);
  });
  const flattener = createMapper(treeToFlame);

  connect(merger.o.all, expander.i.d_val);
  connect(expander.o.d_val, flattener.i.d_val);

  const i = <InPorts<In<T>>>{};
  for (let j = 0, count = inPorts.length; j < count; j++) {
    const port = inPorts[j];
    i[port] = merger.i[port];
  }
  const o = {
    d_model: flattener.o.d_val
  };

  return {i, o};
}
