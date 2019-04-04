import {connect, Node} from "1e14";
import {createDomLinkView, createDomListItemView} from "ninety-ui-dom";
import {createParentView, ParentViewIn, ParentViewOut} from "ninety-view";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type MainMenuView = Node<In, Out>;

/**
 * @param path
 * @param depth
 */
export function createMainMenuView(
  path: string,
  depth: number = 0
): MainMenuView {
  const view = createParentView(() => path, depth);
  const menuItemView = createDomListItemView(depth + 1);
  const menuLinkView = createDomLinkView(() => "childNodes,0:A", depth + 2);

  connect(view.o.d_vm, menuItemView.i.d_vm);
  connect(menuItemView.o.d_vm, menuLinkView.i.d_vm);
  connect(menuLinkView.o.d_view, menuItemView.i.d_view);
  connect(menuItemView.o.d_view, view.i.d_view);

  return view;
}
