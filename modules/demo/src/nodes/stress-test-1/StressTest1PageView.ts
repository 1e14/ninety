import {createFlameDiffSplitter} from "gravel-core";
import {createParentView, ParentViewIn, ParentViewOut} from "gravel-view";
import {connect, Node} from "river-core";
import {createControlButtonView} from "./ControlButtonView";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type StressTest1PageView = Node<In, Out>;

/**
 * TODO: Farm out DomButtonView
 * TODO: Farm out DomListView
 * @param path
 * @param depth
 */
export function createStressTest1PageView(
  path: string,
  depth: number = 0
): StressTest1PageView {
  const view = createParentView(() => path, depth);
  const buttonList = createParentView(() => "childNodes,0:div", depth + 1);
  const buttonListItem = createControlButtonView((index) =>
    "childNodes,0:div,childNodes," + index + ":button", depth + 2);
  const splitter = createFlameDiffSplitter({
    d_buttons: ["buttons"]
  }, depth + 1);

  connect(view.o.d_vm, splitter.i.d_diff);
  connect(splitter.o.d_buttons, buttonListItem.i.d_vm);
  connect(buttonList.o.d_vm, buttonListItem.i.d_vm);
  connect(buttonListItem.o.d_view, buttonList.i.d_view);
  connect(buttonList.o.d_view, view.i.d_view);

  // tslint:disable:no-console
  connect(buttonListItem.o.ev_click, console.log);

  return view;
}
