import {createParentView, ParentViewIn, ParentViewOut} from "gravel-view";
import {createDomTextView2} from "gravel-view-dom-lib";
import {connect, Node} from "river-core";

export type HelloWorldPageView = Node<ParentViewIn, ParentViewOut>;

export function createHelloWorldPageView(): HelloWorldPageView {
  const textView = createDomTextView2();
  const view = createParentView(() => "body.childNodes.1:div", 0);

  connect(textView.o.d_view, view.i.d_view);
  connect(view.o.d_vm, textView.i.d_vm);

  return view;
}
