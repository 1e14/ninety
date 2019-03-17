import {createFlameSplitter} from "gravel-core";
import {createParentView, ParentViewIn, ParentViewOut} from "gravel-view";
import {createLeafView} from "gravel-view/dist";
import {connect, Node} from "river-core";
import {createHelloWorldPageView} from "./HelloWorldPageView";
import {createMainMenuView} from "./MainMenuView";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type MainPageView = Node<In, Out>;

export function createMainPageView(): MainPageView {
  const view = createParentView(() => "body");
  const mainMenuView = createMainMenuView("childNodes.0:ul", 1);
  const emptyPageView = createLeafView(() => "childNodes.1:div");
  const helloWorldPageView = createHelloWorldPageView("childNodes.1:div", 1);
  const splitter = createFlameSplitter({
    d_content: ["content"],
    d_hello: ["hello"],
    d_menu: ["menu"]
  }, 1);

  connect(view.o.d_vm, splitter.i.d_flames);
  connect(splitter.o.d_menu, mainMenuView.i.d_vm);
  connect(splitter.o.d_content, emptyPageView.i.d_vm);
  connect(splitter.o.d_hello, helloWorldPageView.i.d_vm);
  connect(mainMenuView.o.d_view, view.i.d_view);
  connect(emptyPageView.o.d_view, view.i.d_view);
  connect(helloWorldPageView.o.d_view, view.i.d_view);

  return view;
}
