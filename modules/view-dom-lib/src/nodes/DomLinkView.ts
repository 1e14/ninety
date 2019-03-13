import {createDiffSplitter, Diff} from "gravel-core";
import {ViewIn, ViewOut} from "gravel-view";
import {createDomPropertyView} from "gravel-view-dom";
import {Any, connect, Node} from "river-core";
import {createNoop} from "river-stdlib";

export type In = ViewIn;

export type Out = ViewOut;

export type DomLinkView = Node<In, Out>;

export function createDomLinkView(
  path: string,
  depth: number = 0
): DomLinkView {
  const textView = createDomPropertyView(
    path, "content", "innerText");
  const urlView = createDomPropertyView(
    path, "url", "href");
  const splitter = createDiffSplitter({
    d_text: ["content"],
    d_url: ["url"]
  }, depth);
  const evSmp = createNoop<any>();
  const vDiff = createNoop<Diff<Any>>();

  connect(splitter.o.d_text, textView.i.vm_diff);
  connect(splitter.o.d_url, urlView.i.vm_diff);
  connect(evSmp.o.d_val, textView.i.ev_smp);
  connect(evSmp.o.d_val, urlView.i.ev_smp);
  connect(textView.o.v_diff, vDiff.i.d_val);
  connect(urlView.o.v_diff, vDiff.i.d_val);

  return {
    i: {
      ev_smp: evSmp.i.d_val,
      v_diff: vDiff.i.d_val,
      vm_diff: splitter.i.d_diff
    },
    o: {
      ev_smp: evSmp.o.d_val,
      v_diff: vDiff.o.d_val
    }
  };
}
