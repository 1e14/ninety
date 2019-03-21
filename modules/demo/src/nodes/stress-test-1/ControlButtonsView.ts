import {connect, Node} from "1e14";
import {
  createFlameSplitter,
  createParentView,
  Flame,
  ParentViewIn,
  ParentViewOut,
  PathMapperCallback
} from "90";
import {createControlButtonView} from "./ControlButtonView";

export type In = ParentViewIn;

export type Out = ParentViewOut & {
  ev_start: Flame;
  ev_stop: Flame;
};

export type ControlButtonsView = Node<In, Out>;

export function createControlButtonsView(
  cb: PathMapperCallback,
  depth: number = 0
): ControlButtonsView {
  const view = createParentView(cb, depth);
  const indexByName = {
    start: 0,
    stop: 1
  };
  const controlButton = createControlButtonView((name) =>
    "childNodes,0:div,childNodes," + indexByName[name] + ":button", depth + 1);
  const splitter = createFlameSplitter({
    ev_start: ["start"],
    ev_stop: ["stop"]
  }, depth + 1);

  connect(view.o.d_vm, controlButton.i.d_vm);
  connect(controlButton.o.d_view, view.i.d_view);
  connect(controlButton.o.ev_click, splitter.i.d_val);

  return {
    i: {
      d_view: view.i.d_view,
      d_vm: view.i.d_vm
    },
    o: {
      d_view: view.o.d_view,
      d_vm: view.o.d_vm,
      ev_start: splitter.o.ev_start,
      ev_stop: splitter.o.ev_stop
    }
  };
}
