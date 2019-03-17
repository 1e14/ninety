import {createLeafView, LeafViewIn, LeafViewOut} from "gravel-view";
import {Node} from "river-core";

export type In = LeafViewIn;

export type Out = LeafViewOut;

export type DomAttributeView = Node<In, Out>;

export function createDomAttributeView(
  attribute: string
): DomAttributeView {
  return createLeafView(() => "attributes," + attribute);
}
