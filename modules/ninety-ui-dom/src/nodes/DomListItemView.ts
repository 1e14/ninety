import {Node} from "flowcode";
import {createParentView, ParentViewIn, ParentViewOut} from "ninety-mvvm";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type DomListItemView = Node<In, Out>;

export function createDomListItemView(
  depth: number = 0
): DomListItemView {
  return createParentView((component) =>
    "childNodes," + component + ":LI", depth);
}
