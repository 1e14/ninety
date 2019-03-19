import {createFlameSplitter, Flame} from "gravel-core";
import {
  createParentView,
  ParentViewIn,
  ParentViewOut,
  PathMapperCallback
} from "gravel-view";
import {connect, Node} from "river-core";
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
  const controlButton = createControlButtonView((index) =>
    "childNodes,0:div,childNodes," + index + ":button", depth + 1);
  // TODO: Needs better button identification
  //  replace numeric VM indexes w/ names
  const splitter = createFlameSplitter({
    ev_start: ["0"],
    ev_stop: ["1"]
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
