import {createFlameDiffSplitter} from "gravel-core";
import {createParentView, ParentViewIn, ParentViewOut} from "gravel-view";
import {createDomTextView} from "gravel-view-dom-lib";
import {connect, Node} from "river-core";
import {createControlButtonsView} from "./ControlButtonsView";
import {createStressTableView} from "./StressTableView";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type StressTest1PageView = Node<In, Out>;

/**
 * @param path
 * @param depth
 */
export function createStressTest1PageView(
  path: string,
  depth: number = 0
): StressTest1PageView {
  const view = createParentView(() => path, depth);
  const buttons = createControlButtonsView(() => "childNodes,0:div", depth + 1);
  const description = createDomTextView(() => "childNodes,1:p", depth + 1);
  const table = createStressTableView(() => "childNodes,2:table", depth + 1);
  const splitter = createFlameDiffSplitter({
    d_buttons: ["buttons"],
    d_desc: ["desc"],
    d_table: ["table"]
  }, depth + 1);

  connect(view.o.d_vm, splitter.i.d_diff);
  connect(splitter.o.d_buttons, buttons.i.d_vm);
  connect(splitter.o.d_desc, description.i.d_vm);
  connect(splitter.o.d_table, table.i.d_vm);
  connect(buttons.o.d_view, view.i.d_view);
  connect(description.o.d_view, view.i.d_view);
  connect(table.o.d_view, view.i.d_view);

  // tslint:disable:no-console
  connect(buttons.o.ev_start, () => console.log("start"));
  connect(buttons.o.ev_stop, () => console.log("stop"));

  return view;
}
