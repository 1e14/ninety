import {createView, ViewIn, ViewOut} from "gravel-view";
import {createDomTextView} from "gravel-view-dom-lib";
import {connect, Node} from "river-core";
import {createMapper} from "river-stdlib";

export type HelloWorldPageView = Node<ViewIn<{}>, ViewOut>;

export function createHelloWorldPageView(path: string = ""): HelloWorldPageView {
  const textSource = createMapper(() => ({
    del: {},
    set: {
      content: "Hello World!"
    }
  }));
  const textView = createDomTextView("childNodes.0:span");
  const view = createView<{}>(path, () => ({del: {}, set: {}}));

  connect(textView.o.ev_smp, textSource.i.d_val);
  connect(textSource.o.d_val, textView.i.vm_diff);
  connect(textView.o.v_diff, view.i.v_diff);
  connect(view.o.ev_smp, textView.i.ev_smp);

  return view;
}
