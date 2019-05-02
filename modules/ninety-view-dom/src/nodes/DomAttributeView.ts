import {Node} from "1e14";
import {ValueMapperCallback} from "flamejet";
import {createLeafView, LeafViewIn, LeafViewOut} from "ninety-mvvm";

export type In = LeafViewIn;

export type Out = LeafViewOut;

export type DomAttributeView = Node<In, Out>;

export function createDomAttributeView(
  attribute: string,
  cbValue?: ValueMapperCallback
): DomAttributeView {
  return createLeafView(() => "attributes," + attribute, cbValue);
}
