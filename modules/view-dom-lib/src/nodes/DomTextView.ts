import {ViewIn, ViewOut} from "gravel-view";
import {createDomPropertyView} from "gravel-view-dom";
import {Node} from "river-core";

export type In = ViewIn;

export type Out = ViewOut;

/**
 * @deprecated Use DomTextView2
 */
export type DomTextView = Node<In, Out>;

/**
 * TODO: Change 'content' to 'text'.
 * @deprecated Use createDomTextView2
 * @param path
 */
export function createDomTextView(
  path: string
): DomTextView {
  return createDomPropertyView(
    path,
    "content",
    "innerText");
}
