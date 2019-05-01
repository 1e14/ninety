import {Node} from "1e14";
import {createLeaf, LeafIn, LeafOut, ValueMapperCallback} from "flamejet";

export type In = LeafIn;

export type Out = LeafOut;

export type DomClassView = Node<In, Out>;

export function createDomClassView(
  cssClass: string,
  cbValue?: ValueMapperCallback
): DomClassView {
  return createLeaf(() => "classList," + cssClass, cbValue);
}
