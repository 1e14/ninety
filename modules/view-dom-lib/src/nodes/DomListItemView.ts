import {createParentView, ParentViewIn, ParentViewOut} from "gravel-view";
import {Node} from "river-core";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type DomListItemView = Node<In, Out>;

export function createDomListItemView(
  depth: number = 0
): DomListItemView {
  return createParentView((component) =>
    "childNodes," + component + ":li", depth);
}
