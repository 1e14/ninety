import {connect, Node} from "1e14";
import {createFlameSplitter} from "flamejet";
import {
  createLeafView,
  createParentView,
  ParentViewIn,
  ParentViewOut
} from "ninety-view";
import {createHelloWorldPageView} from "./hello-world";
import {createMainMenuView} from "./MainMenuView";
import {createStressTest1PageView} from "./stress-test-1";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type MainPageView = Node<In, Out>;

export function createMainPageView(): MainPageView {
  const view = createParentView(() => "childNodes.0:DIV");
  const mainMenuView = createMainMenuView("childNodes.0:UL", 1);
  const emptyPageView = createLeafView(() => "childNodes.1:DIV");
  const helloWorldPageView = createHelloWorldPageView("childNodes.1:DIV", 1);
  const stressTest1PageView = createStressTest1PageView("childNodes.1:DIV", 1);
  const splitter = createFlameSplitter({
    d_content: ["content"],
    d_hello: ["hello"],
    d_menu: ["menu"],
    d_stress1: ["stress1"]
  }, 1);

  connect(view.o.d_vm, splitter.i.d_val);
  connect(splitter.o.d_menu, mainMenuView.i.d_vm);
  connect(splitter.o.d_content, emptyPageView.i.d_vm);
  connect(splitter.o.d_hello, helloWorldPageView.i.d_vm);
  connect(splitter.o.d_stress1, stressTest1PageView.i.d_vm);
  connect(mainMenuView.o.d_view, view.i.d_view);
  connect(emptyPageView.o.d_view, view.i.d_view);
  connect(helloWorldPageView.o.d_view, view.i.d_view);
  connect(stressTest1PageView.o.d_view, view.i.d_view);

  return view;
}
