import {Node} from "1e14";
import {createLeafView, LeafViewIn, LeafViewOut} from "ninety-view";

export type In = LeafViewIn;

export type Out = LeafViewOut;

export type DomAttributeView = Node<In, Out>;

export function createDomAttributeView(
  attribute: string
): DomAttributeView {
  return createLeafView(() => "attributes," + attribute);
}
