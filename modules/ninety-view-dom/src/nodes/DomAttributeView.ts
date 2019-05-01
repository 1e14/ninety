import {Node} from "1e14";
import {createLeaf, LeafIn, LeafOut, ValueMapperCallback} from "flamejet";

export type In = LeafIn;

export type Out = LeafOut;

export type DomAttributeView = Node<In, Out>;

export function createDomAttributeView(
  attribute: string,
  cbValue?: ValueMapperCallback
): DomAttributeView {
  return createLeaf(() => "attributes," + attribute, cbValue);
}
