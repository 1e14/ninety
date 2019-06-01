import {ValueMapperCallback} from "flamejet";
import {Node} from "flowcode";
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
