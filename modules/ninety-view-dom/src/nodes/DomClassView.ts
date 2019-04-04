import {Node} from "1e14";
import {createLeafView, LeafViewIn, LeafViewOut} from "ninety-view";

export type In = LeafViewIn;

export type Out = LeafViewOut;

export type DomClassView = Node<In, Out>;

export function createDomClassView(
  cssClass: string
): DomClassView {
  return createLeafView(() => "classList," + cssClass);
}
