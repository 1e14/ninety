import {createFlameSplitter} from "gravel-core";
import {createParentView, ParentViewIn, ParentViewOut} from "gravel-view";
import {createDomTextView} from "gravel-view-dom-lib";
import {connect, Node} from "river-core";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type HelloWorldPageView = Node<In, Out>;

export function createHelloWorldPageView(
  path: string,
  depth: number = 0
): HelloWorldPageView {
  const view = createParentView(() => path, depth);
  const textView = createDomTextView(() => "childNodes.0:span", depth + 1);
  const splitter = createFlameSplitter<"d_caption">({
    d_caption: ["caption"]
  }, depth + 1);

  connect(view.o.d_vm, splitter.i.d_flames);
  connect(splitter.o.d_caption, textView.i.d_vm);
  connect(textView.o.d_view, view.i.d_view);

  return view;
}
