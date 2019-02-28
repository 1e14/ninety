import {Diff} from "gravel-types";
import {createEventListener, createTextView} from "gravel-view-dom-lib";
import {connect, InPorts, Node, OutPorts} from "river-core";
import {createNoop} from "river-stdlib";

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

export function createCustomTextView(): CustomTextView {
  const noop1 = createNoop();
  const textView = createTextView();
  const clickListener = createEventListener("onclick");
  const noop2 = createNoop();

  connect(noop1.o.d_val, textView.i.d_content);
  connect(noop1.o.d_val, clickListener.i.ev_smp);
  connect(clickListener.o.d_diff, noop2.i.d_val);
  connect(textView.o.d_diff, noop2.i.d_val);

  const i: InPorts<In> = {
    d_content: noop1.i.d_val
  };

  const o: OutPorts<Out> = {
    d_diff: noop2.o.d_val,
    ev_click: clickListener.o.ev_event
  };

  return {i, o};
}
