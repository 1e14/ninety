import {connect, Node} from "1e14";
import {
  createDomPropertyView,
  createFlameDiffSplitter,
  createParentView,
  ParentViewIn,
  ParentViewOut,
  PathMapperCallback
} from "90";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type DomTextView = Node<In, Out>;

export function createDomTextView(
  cb: PathMapperCallback,
  depth: number = 0
): DomTextView {
  const view = createParentView(cb, depth);
  const textView = createDomPropertyView("innerText");

  const splitter = createFlameDiffSplitter<"d_text">({
    d_text: ["text"]
  }, depth + 1);

  connect(view.o.d_vm, splitter.i.d_diff);
  connect(splitter.o.d_text, textView.i.d_vm);
  connect(textView.o.d_view, view.i.d_view);

  return view;
}
