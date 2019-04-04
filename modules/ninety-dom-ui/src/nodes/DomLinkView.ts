import {connect, Node} from "1e14";
import {createFlameDiffSplitter} from "flamejet";
import {
  createParentView,
  ParentViewIn,
  ParentViewOut,
  PathMapperCallback
} from "ninety-view";
import {createDomPropertyView} from "ninety-view-dom";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type DomLinkView = Node<In, Out>;

export function createDomLinkView(
  cb: PathMapperCallback,
  depth: number = 0
): DomLinkView {
  const textView = createDomPropertyView("innerText");
  const urlView = createDomPropertyView("href");
  const view = createParentView(cb, depth);
  const splitter = createFlameDiffSplitter<"d_text" | "d_url">({
    d_text: ["text"],
    d_url: ["url"]
  }, depth + 1);

  connect(view.o.d_vm, splitter.i.d_diff);
  connect(splitter.o.d_text, textView.i.d_vm);
  connect(splitter.o.d_url, urlView.i.d_vm);
  connect(textView.o.d_view, view.i.d_view);
  connect(urlView.o.d_view, view.i.d_view);

  return view;
}
