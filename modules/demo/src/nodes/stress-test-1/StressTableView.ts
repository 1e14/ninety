import {connect, Node} from "1e14";
import {createFlameDiffSplitter} from "gravel-core";
import {
  createParentView,
  ParentViewIn,
  ParentViewOut,
  PathMapperCallback
} from "gravel-view";
import {createDomTableCellView, createDomTextView} from "gravel-view-dom-lib";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type StressTableView = Node<In, Out>;

export function createStressTableView(
  cb: PathMapperCallback,
  depth: number = 0
): StressTableView {
  const view = createParentView(cb, depth);
  const cell = createDomTableCellView(depth + 1);
  const text = createDomTextView(() => "childNodes,0:span", depth + 2);
  const splitter = createFlameDiffSplitter({
    d_content: ["content"]
  }, depth + 2);

  connect(view.o.d_vm, cell.i.d_vm);
  connect(cell.o.d_vm, splitter.i.d_diff);
  connect(splitter.o.d_content, text.i.d_vm);
  connect(text.o.d_view, cell.i.d_view);
  connect(cell.o.d_view, view.i.d_view);

  return view;
}
