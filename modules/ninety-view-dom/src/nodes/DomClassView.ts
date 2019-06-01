import {ValueMapperCallback} from "flamejet";
import {Node} from "flowcode";
import {createLeafView, LeafViewIn, LeafViewOut} from "ninety-mvvm";

export type In = LeafViewIn;

export type Out = LeafViewOut;

export type DomClassView = Node<In, Out>;

export function createDomClassView(
  cssClass: string,
  cbValue?: ValueMapperCallback
): DomClassView {
  return createLeafView(() => "classList," + cssClass, cbValue);
}
