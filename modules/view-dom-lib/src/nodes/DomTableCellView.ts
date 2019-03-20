import {createParentView, ParentViewIn, ParentViewOut} from "gravel-view";
import {Node} from "river-core";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type DomTableCellView = Node<In, Out>;

export function createDomTableCellView(
  depth: number = 0
): DomTableCellView {
  return createParentView((component) => {
    const pos = component.indexOf(",");
    const row = component.slice(0, pos);
    const column = component.slice(pos + 1);
    return "childNodes," + row + ":tr,childNodes," + column + ":td";
  }, depth);
}
