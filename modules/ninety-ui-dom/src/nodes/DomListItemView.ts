import {Node} from "1e14";
import {createFlameBodyMapper, FlameBodyMapperIn, FlameBodyMapperOut} from "flamejet";

export type In = FlameBodyMapperIn;

export type Out = FlameBodyMapperOut;

export type DomListItemView = Node<In, Out>;

export function createDomListItemView(
  depth: number = 0
): DomListItemView {
  return createFlameBodyMapper((component) =>
    "childNodes," + component + ":LI", depth);
}
