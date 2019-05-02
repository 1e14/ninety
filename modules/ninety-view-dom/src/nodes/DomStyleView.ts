import {Node} from "1e14";
import {createFlameEdgeMapper, FlameEdgeMapperIn, FlameEdgeMapperOut, ValueMapperCallback} from "flamejet";

export type In = FlameEdgeMapperIn;

export type Out = FlameEdgeMapperOut;

export type DomStyleView = Node<In, Out>;

export function createDomStyleView(
  style: string,
  cbValue?: ValueMapperCallback
): DomStyleView {
  return createFlameEdgeMapper(() => "style," + style, cbValue);
}
