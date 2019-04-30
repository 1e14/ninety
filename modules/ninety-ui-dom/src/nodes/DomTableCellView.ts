import {Node} from "1e14";
import {createParent, ParentIn, ParentOut} from "flamejet";

export type In = ParentIn;

export type Out = ParentOut;

export type DomTableCellView = Node<In, Out>;

export function createDomTableCellView(
  depth: number = 0
): DomTableCellView {
  return createParent((component) => {
    const pos = component.indexOf(",");
    const row = component.slice(0, pos);
    const column = component.slice(pos + 1);
    return "childNodes," + row + ":TR,childNodes," + column + ":TD";
  }, depth);
}
