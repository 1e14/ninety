import {Node} from "1e14";
import {createFlameEdgeMapper, FlameEdgeMapperIn, FlameEdgeMapperOut, ValueMapperCallback} from "flamejet";

export type In = FlameEdgeMapperIn;

export type Out = FlameEdgeMapperOut;

export type DomPropertyView = Node<In, Out>;

export function createDomPropertyView(
  property: string,
  cbValue?: ValueMapperCallback
): DomPropertyView {
  return createFlameEdgeMapper(() => property, cbValue);
}
