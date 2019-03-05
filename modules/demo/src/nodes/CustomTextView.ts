import {createDiffPrefixer, Diff} from "gravel-core";
import {ViewIn, ViewOut} from "gravel-view-dom";
import {
  createEventListener,
  createTextView,
  TextVmProps
} from "gravel-view-dom-lib";
import {TextView} from "gravel-view-dom-lib/dist";
import {connect, InPorts, Node, OutPorts} from "river-core";
import {createMapper, createNoop} from "river-stdlib";

export type In = ViewIn<TextVmProps>;

export type Out = ViewOut & {
  ev_click: MouseEvent;
};

export type CustomTextView = Node<In, Out>;

export function createCustomTextView(prefix: string = ""): CustomTextView {
  const input = createNoop();
  const textView = createTextView(prefix);
  const styleSource = createMapper<any, Diff<any>>(() => ({
    set: {
      "style.color": "red"
    }
  }));
  const styleView = createDiffPrefixer(prefix);
  const clickListener = createEventListener(prefix, "onclick");
  const output = createNoop();

  connect(input.o.d_val, textView.i.vm_diff);
  connect(input.o.d_val, clickListener.i.ev_smp);
  connect(input.o.d_val, styleSource.i.d_val);
  connect(styleSource.o.d_val, styleView.i.d_diff);
  connect(styleView.o.d_diff, output.i.d_val);
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
