import {Node} from "1e14";
import {createLeaf, LeafIn, LeafOut} from "ninety-view";

export type In = LeafIn;

export type Out = LeafOut;

export type DomStyleView = Node<In, Out>;

export function createDomStyleView(
  style: string
): DomStyleView {
  return createLeaf(() => "style," + style);
}
