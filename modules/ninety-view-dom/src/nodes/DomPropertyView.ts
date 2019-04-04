import {Node} from "1e14";
import {createLeafView, LeafViewIn, LeafViewOut} from "ninety-view";

export type In = LeafViewIn;

export type Out = LeafViewOut;

export type DomPropertyView = Node<In, Out>;

export function createDomPropertyView(
  property: string
): DomPropertyView {
  return createLeafView(() => property);
}
