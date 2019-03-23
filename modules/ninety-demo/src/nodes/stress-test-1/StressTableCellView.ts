import {connect, Node} from "1e14";
import {createFlameDiffSplitter, ParentViewIn, ParentViewOut} from "ninety";
import {createDomTableCellView, createDomTextView} from "ninety-dom-ui";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type StressTableCellView = Node<In, Out>;

export function createStressTableCellView(
  depth: number = 0
): StressTableCellView {
  const view = createDomTableCellView(depth);
  const text = createDomTextView(() => "childNodes,0:span", depth + 1);
  const splitter = createFlameDiffSplitter({
    d_content: ["content"]
  }, depth + 1);

  connect(view.o.d_vm, splitter.i.d_diff);
  connect(splitter.o.d_content, text.i.d_vm);
  connect(text.o.d_view, view.i.d_view);

  return view;
}
