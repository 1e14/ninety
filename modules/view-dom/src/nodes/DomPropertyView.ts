import {createLeafView, LeafViewIn, LeafViewOut} from "gravel-view";
import {Node} from "river-core";

export type In = LeafViewIn;

export type Out = LeafViewOut;

export type DomPropertyView = Node<In, Out>;

export function createDomPropertyView(
  property: string
): DomPropertyView {
  return createLeafView(() => property);
}
