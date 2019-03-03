import {createDiffPrefixer, Diff} from "gravel-core";
import {createEventListener, createTextView} from "gravel-view-dom-lib";
import {connect, InPorts, Node, OutPorts} from "river-core";
import {createMapper, createNoop} from "river-stdlib";

export type In = {
  d_content: string;
};

export type Out = {
  d_diff: Diff<{
    "innerText": string;
    "style.color": string;
  }>;
  ev_click: MouseEvent
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

  connect(input.o.d_val, textView.i.d_content);
  connect(input.o.d_val, clickListener.i.ev_smp);
  connect(input.o.d_val, styleSource.i.d_val);
  connect(styleSource.o.d_val, styleView.i.d_diff);
  connect(styleView.o.d_diff, output.i.d_val);
  connect(clickListener.o.d_diff, output.i.d_val);
  connect(textView.o.d_diff, output.i.d_val);

  const i: InPorts<In> = {
    d_content: input.i.d_val
  };

  const o: OutPorts<Out> = {
    d_diff: output.o.d_val,
    ev_click: clickListener.o.d_event
  };

  return {i, o};
}
