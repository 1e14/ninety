import {createFlameSplitter} from "gravel-core";
import {createParentView, ParentViewIn, ParentViewOut} from "gravel-view";
import {createDomTextView2} from "gravel-view-dom-lib";
import {connect, Node} from "river-core";

export type HelloWorldPageView = Node<ParentViewIn, ParentViewOut>;

export function createHelloWorldPageView(
  path: string,
  depth: number = 0
): HelloWorldPageView {
  const view = createParentView(() => path, depth);
  const textView = createDomTextView2();
  const splitter = createFlameSplitter({
    d_text: ["text"]
  }, depth + 1);

  connect(view.o.d_vm, splitter.i.d_flames);
  connect(splitter.o.d_text, textView.i.d_vm);
  connect(textView.o.d_view, view.i.d_view);

  return view;
}
