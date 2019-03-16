import {createLeafView, LeafViewIn, LeafViewOut} from "gravel-view";
import {Node} from "river-core";

export type In = LeafViewIn;

export type Out = LeafViewOut;

export type DomPropertyView2 = Node<In, Out>;

export function createDomPropertyView2(
  property: string
): DomPropertyView2 {
  return createLeafView(() => property);
}
