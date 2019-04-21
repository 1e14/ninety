import {connect, InPorts, Node} from "1e14";
import {createSyncer} from "1e14-flow";
import {createMapper} from "1e14-fp";
import {Flame, treeToFlame} from "flamejet";
import {ModelBuffer, Models, ReferenceConfig} from "../types";
import {expandModel} from "../utils/expandModel";

export type In<T extends Models> = {
  [type in keyof T]: ModelBuffer<T[type]>
};

export type Out = {
  d_model: Flame;
};

export type ModelExpander<T extends Models> = Node<In<T>, Out>;

export function createModelExpander<T extends Models>(
  config: ReferenceConfig<T>
): ModelExpander<T> {
  const inPorts = Object.keys(config);

  const syncer = createSyncer<In<T>>(inPorts);
  const expander = createMapper<In<T>, any>((value) => {
    return expandModel(value, config);
  });
  const flattener = createMapper(treeToFlame);

  connect(syncer.o.all, expander.i.d_val);
  connect(expander.o.d_val, flattener.i.d_val);

  const i = <InPorts<In<T>>>{};
  for (let j = 0, count = inPorts.length; j < count; j++) {
    const port = inPorts[j];
    i[port] = syncer.i[port];
  }
  const o = {
    d_model: flattener.o.d_val
  };

  return {i, o};
}
