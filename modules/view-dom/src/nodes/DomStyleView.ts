import {createLeafView, LeafViewIn, LeafViewOut} from "gravel-view";
import {Node} from "river-core";

export type In = LeafViewIn;

export type Out = LeafViewOut;

export type DomStyleView = Node<In, Out>;

export function createDomStyleView(
  cssClass: string
): DomStyleView {
  return createLeafView(() => "style," + cssClass);
}
