import {Node} from "1e14";
import {createLeaf, LeafIn, LeafOut} from "ninety-view";

export type In = LeafIn;

export type Out = LeafOut;

export type DomPropertyView = Node<In, Out>;

export function createDomPropertyView(
  property: string
): DomPropertyView {
  return createLeaf(() => property);
}
