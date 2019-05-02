import {Node} from "1e14";
import {ValueMapperCallback} from "flamejet";
import {createLeafView, LeafViewIn, LeafViewOut} from "ninety-mvvm";

export type In = LeafViewIn;

export type Out = LeafViewOut;

export type DomStyleView = Node<In, Out>;

export function createDomStyleView(
  style: string,
  cbValue?: ValueMapperCallback
): DomStyleView {
  return createLeafView(() => "style," + style, cbValue);
}
