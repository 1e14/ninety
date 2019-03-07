import {createView, ViewIn, ViewOut} from "gravel-view-dom";
import {
  createEventView,
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

export function createCustomTextView(
  prefix: string = "",
  initialVm?: Partial<TextVmProps>
): CustomTextView {
  const vmDiff = createNoop();
  const evSmpIn = createNoop();
  const evSmpOut = createNoop();
  const vDiff = createNoop();
  const textView = createTextView(prefix, initialVm);
  const styleView = createView(prefix, () => ({
    del: {},
    set: {
      "style.color": "red"
    }
  }), {});
  const clickView = createEventView(prefix, "onclick");

  connect(evSmpIn.o.d_val, textView.i.ev_smp);
  connect(evSmpIn.o.d_val, styleView.i.ev_smp);
  connect(evSmpIn.o.d_val, clickView.i.ev_smp);
  connect(vmDiff.o.d_val, textView.i.vm_diff);
  connect(styleView.o.v_diff, vDiff.i.d_val);
  connect(clickView.o.v_diff, vDiff.i.d_val);
  connect(textView.o.v_diff, vDiff.i.d_val);
  connect(styleView.o.ev_smp, evSmpOut.i.d_val);
  connect(textView.o.ev_smp, evSmpOut.i.d_val);

  const i: InPorts<In> = {
    ev_smp: evSmpIn.i.d_val,
    v_diff: null,
    vm_diff: vmDiff.i.d_val
  };

  const o: OutPorts<Out> = {
    ev_click: clickView.o.d_event,
    ev_smp: evSmpOut.o.d_val,
    v_diff: vDiff.o.d_val
  };

  return {i, o};
}
