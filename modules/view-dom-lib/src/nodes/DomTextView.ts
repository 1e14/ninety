import {LeafViewIn, LeafViewOut} from "gravel-view";
import {createDomPropertyView} from "gravel-view-dom";
import {Node} from "river-core";

export type In = LeafViewIn;

export type Out = LeafViewOut;

export type DomTextView = Node<In, Out>;

/**
 * TODO: Refactor into parent view.
 */
export function createDomTextView(): DomTextView {
  return createDomPropertyView("innerText");
}
