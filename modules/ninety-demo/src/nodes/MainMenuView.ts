import {connect, Node} from "1e14";
import {createPathBodyMapper, ParentIn, ParentOut} from "flamejet";
import {createDomLinkView, createDomListItemView} from "ninety-ui-dom";

export type In = ParentIn;

export type Out = ParentOut;

export type MainMenuView = Node<In, Out>;

/**
 * @param path
 * @param depth
 */
export function createMainMenuView(
  path: string,
  depth: number = 0
): MainMenuView {
  const view = createPathBodyMapper(() => path, depth);
  const menuItemView = createDomListItemView(depth + 1);
  const menuLinkView = createDomLinkView(() => "childNodes,0:A", depth + 2);

  connect(view.o.d_in, menuItemView.i.d_in);
  connect(menuItemView.o.d_in, menuLinkView.i.d_in);
  connect(menuLinkView.o.d_out, menuItemView.i.d_out);
  connect(menuItemView.o.d_out, view.i.d_out);

  return view;
}
