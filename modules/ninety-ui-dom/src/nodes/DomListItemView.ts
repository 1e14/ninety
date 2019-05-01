import {Node} from "1e14";
import {createPathBodyMapper, ParentIn, ParentOut} from "flamejet";

export type In = ParentIn;

export type Out = ParentOut;

export type DomListItemView = Node<In, Out>;

export function createDomListItemView(
  depth: number = 0
): DomListItemView {
  return createPathBodyMapper((component) =>
    "childNodes," + component + ":LI", depth);
}
