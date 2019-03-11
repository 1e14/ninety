import {createView, ViewIn, ViewOut} from "gravel-view";
import {createDomTextView} from "gravel-view-dom-lib";
import {connect, Node} from "river-core";

export type HelloWorldPageView = Node<ViewIn<{}>, ViewOut>;

export function createHelloWorldPageView(path: string = ""): HelloWorldPageView {
  const textView = createDomTextView("childNodes.0:span", {
    content: "Hello World!"
  });
  const view = createView<{}>(path, () => ({del: {}, set: {}}));

  connect(textView.o.v_diff, view.i.v_diff);
  connect(view.o.ev_smp, textView.i.ev_smp);

  return view;
}
