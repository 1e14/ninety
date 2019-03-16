import {createFlameSplitter} from "gravel-core";
import {
  createParentView,
  ParentViewIn,
  ParentViewOut,
  PathMapperCallback
} from "gravel-view";
import {createDomPropertyView2} from "gravel-view-dom";
import {connect, Node} from "river-core";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type DomLinkView2 = Node<In, Out>;

export function createDomLinkView2(
  cb: PathMapperCallback,
  depth: number = 0
): DomLinkView2 {
  const textView = createDomPropertyView2("innerText");
  const urlView = createDomPropertyView2("href");
  const view = createParentView(cb, depth);
  const splitter = createFlameSplitter<"d_text" | "d_url">({
    d_text: ["content"],
    d_url: ["url"]
  }, depth + 1);

  connect(view.o.d_vm, splitter.i.d_flames);
  connect(splitter.o.d_text, textView.i.d_vm);
  connect(splitter.o.d_url, urlView.i.d_vm);
  connect(textView.o.d_view, view.i.d_view);
  connect(urlView.o.d_view, view.i.d_view);

  return view;
}
