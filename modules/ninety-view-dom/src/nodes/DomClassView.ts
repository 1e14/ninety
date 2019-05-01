import {Node} from "1e14";
import {createPathTailMapper, LeafIn, LeafOut, ValueMapperCallback} from "flamejet";

export type In = LeafIn;

export type Out = LeafOut;

export type DomClassView = Node<In, Out>;

export function createDomClassView(
  cssClass: string,
  cbValue?: ValueMapperCallback
): DomClassView {
  return createPathTailMapper(() => "classList," + cssClass, cbValue);
}
