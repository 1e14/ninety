import {Node} from "1e14";
import {createPathTailMapper, LeafIn, LeafOut, ValueMapperCallback} from "flamejet";

export type In = LeafIn;

export type Out = LeafOut;

export type DomPropertyView = Node<In, Out>;

export function createDomPropertyView(
  property: string,
  cbValue?: ValueMapperCallback
): DomPropertyView {
  return createPathTailMapper(() => property, cbValue);
}
