import {Node} from "1e14";
import {createParentView, ParentViewIn, ParentViewOut} from "ninety";

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
    return "childNodes," + row + ":TR,childNodes," + column + ":TD";
  }, depth);
}
