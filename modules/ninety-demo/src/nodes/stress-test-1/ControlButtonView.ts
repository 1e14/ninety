import {connect, Node} from "1e14";
import {
  createDomPropertyView,
  createFlameDiffSplitter,
  createParentView,
  Flame,
  ParentViewIn,
  ParentViewOut,
  PathMapperCallback
} from "ninety";
import {createDomEventView} from "ninety-dom-ui";

export type In = ParentViewIn;

export type Out = ParentViewOut & {
  ev_click: Flame;
};

export type ControlButtonView = Node<In, Out>;

/**
 * TODO: Move to ninety-dom-ui?
 * @param cb
 * @param depth
 */
export function createControlButtonView(
  cb: PathMapperCallback,
  depth: number = 0
): ControlButtonView {
  const view = createParentView(cb, depth);
  const buttonText = createDomPropertyView("innerText");
  const buttonClick = createDomEventView("onclick");
  const splitter = createFlameDiffSplitter({
    d_click: ["click"],
    d_text: ["text"]
  }, depth + 1);

  connect(view.o.d_vm, splitter.i.d_diff);
  connect(splitter.o.d_text, buttonText.i.d_vm);
  connect(splitter.o.d_click, buttonClick.i.d_vm);
  connect(buttonText.o.d_view, view.i.d_view);
  connect(buttonClick.o.d_view, view.i.d_view);

  return {
    i: {
      d_view: view.i.d_view,
      d_vm: view.i.d_vm
    },
    o: {
      d_view: view.o.d_view,
      d_vm: view.o.d_vm,
      ev_click: buttonClick.o.d_event
    }
  };
}
