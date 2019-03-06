import {createView, ViewIn, ViewOut} from "gravel-view-dom";
import {
  createEventListener,
  createTextView,
  TextVmProps
} from "gravel-view-dom-lib";
import {connect, InPorts, Node, OutPorts} from "river-core";
import {createNoop} from "river-stdlib";

export type In = ViewIn<TextVmProps>;

export type Out = ViewOut & {
  ev_click: MouseEvent;
};

export type CustomTextView = Node<In, Out>;

export function createCustomTextView(prefix: string = ""): CustomTextView {
  const input = createNoop();
  const textView = createTextView(prefix);
  const styleView = createView(prefix, () => ({
    set: {
      "style.color": "red"
    }
  }));
  const clickListener = createEventListener(prefix, "onclick");
  const output = createNoop();

  connect(input.o.d_val, textView.i.vm_diff);
  connect(input.o.d_val, clickListener.i.ev_smp);
  connect(input.o.d_val, styleView.i.vm_diff);
  connect(styleView.o.v_diff, output.i.d_val);
  connect(clickListener.o.d_diff, output.i.d_val);
  connect(textView.o.v_diff, output.i.d_val);

  const i: InPorts<In> = {
    v_diff: () => null,
    vm_diff: input.i.d_val
  };

  const o: OutPorts<Out> = {
    ev_click: clickListener.o.d_event,
    v_diff: output.o.d_val
  };

  return {i, o};
}
