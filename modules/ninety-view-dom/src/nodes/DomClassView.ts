import {Node} from "1e14";
import {createLeaf, LeafIn, LeafOut} from "ninety-view";

export type In = LeafIn;

export type Out = LeafOut;

export type DomClassView = Node<In, Out>;

export function createDomClassView(
  cssClass: string
): DomClassView {
  return createLeaf(() => "classList," + cssClass);
}
