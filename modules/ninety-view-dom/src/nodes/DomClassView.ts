import {Node} from "1e14";
import {createFlameEdgeMapper, FlameEdgeMapperIn, FlameEdgeMapperOut, ValueMapperCallback} from "flamejet";

export type In = FlameEdgeMapperIn;

export type Out = FlameEdgeMapperOut;

export type DomClassView = Node<In, Out>;

export function createDomClassView(
  cssClass: string,
  cbValue?: ValueMapperCallback
): DomClassView {
  return createFlameEdgeMapper(() => "classList," + cssClass, cbValue);
}
