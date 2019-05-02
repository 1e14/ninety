import {Node} from "1e14";
import {createFlameEdgeMapper, FlameEdgeMapperIn, FlameEdgeMapperOut, ValueMapperCallback} from "flamejet";

export type In = FlameEdgeMapperIn;

export type Out = FlameEdgeMapperOut;

export type DomAttributeView = Node<In, Out>;

export function createDomAttributeView(
  attribute: string,
  cbValue?: ValueMapperCallback
): DomAttributeView {
  return createFlameEdgeMapper(() => "attributes," + attribute, cbValue);
}
