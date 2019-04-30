import {Node} from "1e14";
import {createParent, ParentIn, ParentOut} from "ninety-view";

export type In = ParentIn;

export type Out = ParentOut;

export type DomListItemView = Node<In, Out>;

export function createDomListItemView(
  depth: number = 0
): DomListItemView {
  return createParent((component) =>
    "childNodes," + component + ":LI", depth);
}
