import {LeafViewIn, LeafViewOut} from "gravel-view";
import {createDomPropertyView2} from "gravel-view-dom";
import {Node} from "river-core";

export type In = LeafViewIn;

export type Out = LeafViewOut;

export type DomTextView2 = Node<In, Out>;

/**
 * @param depth
 */
export function createDomTextView2(
  depth: number
): DomTextView2 {
  return createDomPropertyView2(
    "innerText",
    depth);
}
