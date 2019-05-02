import {connect, Node} from "1e14";
import {createFlameSplitter} from "flamejet";
import {
  createFlameBodyMapper,
  FlameBodyMapperIn,
  FlameBodyMapperOut,
  PathMapperCallback
} from "flamejet";
import {createDomPropertyView} from "ninety-view-dom";

export type In = FlameBodyMapperIn;

export type Out = FlameBodyMapperOut;

export type DomTextView = Node<In, Out>;

export function createDomTextView(
  cb: PathMapperCallback,
  depth: number = 0
): DomTextView {
  const view = createFlameBodyMapper(cb, depth);
  const textView = createDomPropertyView("innerText");

  const splitter = createFlameSplitter<"d_text">({
    d_text: ["text"]
  }, depth + 1);

  connect(view.o.d_in, splitter.i.d_val);
  connect(splitter.o.d_text, textView.i.d_in);
  connect(textView.o.d_out, view.i.d_out);

  return view;
}
