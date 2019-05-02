import {connect, Node} from "1e14";
import {
  createFlameBodyMapper,
  createFlameSplitter,
  FlameBodyMapperIn,
  FlameBodyMapperOut
} from "flamejet";
import {createDomTextView} from "ninety-ui-dom";

export type In = FlameBodyMapperIn;

export type Out = FlameBodyMapperOut;

export type HelloWorldPageView = Node<In, Out>;

export function createHelloWorldPageView(
  path: string,
  depth: number = 0
): HelloWorldPageView {
  const view = createFlameBodyMapper(() => path, depth);
  const textView = createDomTextView(() => "childNodes.0:P", depth + 1);
  const splitter = createFlameSplitter<"d_caption">({
    d_caption: ["caption"]
  }, depth + 1);

  connect(view.o.d_in, splitter.i.d_val);
  connect(splitter.o.d_caption, textView.i.d_in);
  connect(textView.o.d_out, view.i.d_out);

  return view;
}
