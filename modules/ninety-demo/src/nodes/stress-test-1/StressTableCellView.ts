import {connect, Node} from "1e14";
import {createFlameSplitter} from "flamejet";
import {createDomTableCellView, createDomTextView} from "ninety-ui-dom";
import {ParentIn, ParentOut} from "ninety-view";
import {createDomStyleView} from "ninety-view-dom";

export type In = ParentIn;

export type Out = ParentOut;

export type StressTableCellView = Node<In, Out>;

export function createStressTableCellView(
  depth: number = 0
): StressTableCellView {
  const view = createDomTableCellView(depth);
  const text = createDomTextView(() => "childNodes,0:SPAN", depth + 1);
  const color = createDomStyleView("color");
  const callSplitter = createFlameSplitter({
    d_content: ["content"]
  }, depth + 1);
  const textSplitter = createFlameSplitter({
    d_color: ["color"]
  }, depth + 2);

  connect(view.o.d_in, callSplitter.i.d_val);
  connect(callSplitter.o.d_content, text.i.d_in);
  connect(text.o.d_in, textSplitter.i.d_val);
  connect(textSplitter.o.d_color, color.i.d_in);
  connect(color.o.d_out, text.i.d_out);
  connect(text.o.d_out, view.i.d_out);

  return view;
}
