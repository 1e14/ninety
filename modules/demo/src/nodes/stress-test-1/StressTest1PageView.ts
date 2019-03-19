import {createFlameDiffSplitter} from "gravel-core";
import {createParentView, ParentViewIn, ParentViewOut} from "gravel-view";
import {connect, Node} from "river-core";
import {createControlButtonsView} from "./ControlButtonsView";

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
  const buttonList = createControlButtonsView(() => "childNodes,0:div", depth + 1);
  const splitter = createFlameDiffSplitter({
    d_buttons: ["buttons"]
  }, depth + 1);

  connect(view.o.d_vm, splitter.i.d_diff);
  connect(splitter.o.d_buttons, buttonList.i.d_vm);
  connect(buttonList.o.d_view, view.i.d_view);

  // tslint:disable:no-console
  connect(buttonList.o.ev_start, () => console.log("start"));
  connect(buttonList.o.ev_stop, () => console.log("stop"));

  return view;
}
