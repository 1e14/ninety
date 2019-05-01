import {connect, Node} from "1e14";
import {
  createFlameSplitter,
  createPathBodyMapper,
  ParentIn,
  ParentOut,
  PathMapperCallback
} from "flamejet";
import {createDomPropertyView} from "ninety-view-dom";

export type In = ParentIn;

export type Out = ParentOut;

export type DomLinkView = Node<In, Out>;

export function createDomLinkView(
  cb: PathMapperCallback,
  depth: number = 0
): DomLinkView {
  const textView = createDomPropertyView("innerText");
  const urlView = createDomPropertyView("href");
  const view = createPathBodyMapper(cb, depth);
  const splitter = createFlameSplitter<"d_text" | "d_url">({
    d_text: ["text"],
    d_url: ["url"]
  }, depth + 1);

  connect(view.o.d_in, splitter.i.d_val);
  connect(splitter.o.d_text, textView.i.d_in);
  connect(splitter.o.d_url, urlView.i.d_in);
  connect(textView.o.d_out, view.i.d_out);
  connect(urlView.o.d_out, view.i.d_out);

  return view;
}
