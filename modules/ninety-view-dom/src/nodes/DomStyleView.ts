import {Node} from "1e14";
import {createPathTailMapper, LeafIn, LeafOut, ValueMapperCallback} from "flamejet";

export type In = LeafIn;

export type Out = LeafOut;

export type DomStyleView = Node<In, Out>;

export function createDomStyleView(
  style: string,
  cbValue?: ValueMapperCallback
): DomStyleView {
  return createPathTailMapper(() => "style," + style, cbValue);
}
