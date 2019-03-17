import {createLeafView, LeafViewIn, LeafViewOut} from "gravel-view";
import {Node} from "river-core";

export type In = LeafViewIn;

export type Out = LeafViewOut;

export type DomClassView = Node<In, Out>;

export function createDomClassView(
  cssClass: string
): DomClassView {
  return createLeafView(() => "classList," + cssClass);
}
