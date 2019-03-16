import {createFlameSplitter} from "gravel-core";
import {createParentView, ParentViewIn, ParentViewOut} from "gravel-view";
import {createDomLinkView2} from "gravel-view-dom-lib";
import {connect, Node} from "river-core";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type MainMenuView = Node<In, Out>;

/**
 * TODO: Refactor into ListView-based
 * @param path
 * @param depth
 */
export function createMainMenuView(
  path: string,
  depth: number = 0
): MainMenuView {
  const view = createParentView(() => path, depth);
  const item1View = createDomLinkView2(() => "childNodes.0:li.childNodes.0:a", depth + 1);
  const item2View = createDomLinkView2(() => "childNodes.1:li.childNodes.0:a", depth + 1);
  const splitter = createFlameSplitter({
    d_item1: ["item1"],
    d_item2: ["item2"]
  }, depth + 1);

  connect(view.o.d_vm, splitter.i.d_flames);
  connect(splitter.o.d_item1, item1View.i.d_vm);
  connect(splitter.o.d_item2, item2View.i.d_vm);
  connect(item1View.o.d_view, view.i.d_view);
  connect(item2View.o.d_view, view.i.d_view);

  return view;
}
