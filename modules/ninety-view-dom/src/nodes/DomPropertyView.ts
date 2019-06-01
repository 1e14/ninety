import {ValueMapperCallback} from "flamejet";
import {Node} from "flowcode";
import {createLeafView, LeafViewIn, LeafViewOut} from "ninety-mvvm";

export type In = LeafViewIn;

export type Out = LeafViewOut;

export type DomPropertyView = Node<In, Out>;

export function createDomPropertyView(
  property: string,
  cbValue?: ValueMapperCallback
): DomPropertyView {
  return createLeafView(() => property, cbValue);
}
