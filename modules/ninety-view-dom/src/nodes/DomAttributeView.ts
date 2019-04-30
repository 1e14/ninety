import {Node} from "1e14";
import {createLeaf, LeafIn, LeafOut} from "flamejet";

export type In = LeafIn;

export type Out = LeafOut;

export type DomAttributeView = Node<In, Out>;

export function createDomAttributeView(
  attribute: string
): DomAttributeView {
  return createLeaf(() => "attributes," + attribute);
}
