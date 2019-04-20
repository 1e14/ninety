import {connect, createNoop, Node} from "1e14";
import {createFlameSplitter} from "flamejet";
import {createLeafView, ParentViewIn, ParentViewOut} from "ninety-view";
import {createHelloWorldPageView} from "./hello-world";
import {createMainMenuView} from "./MainMenuView";
import {createStressTest1PageView} from "./stress-test-1";

export type In = ParentViewIn;

export type Out = ParentViewOut;

export type MainPageView = Node<In, Out>;

const MAIN_PAGE_DEPTH = 0;

export function createMainPageView(): MainPageView {
  const vm = createNoop();
  const view = createNoop();
  const mainMenuView = createMainMenuView("childNodes.0:UL", MAIN_PAGE_DEPTH);
  const emptyPageView = createLeafView(() => "childNodes.1:DIV");
  const helloWorldPageView = createHelloWorldPageView("childNodes.1:DIV", MAIN_PAGE_DEPTH);
  const stressTest1PageView = createStressTest1PageView("childNodes.1:DIV", MAIN_PAGE_DEPTH);
  const splitter = createFlameSplitter({
    d_content: ["content"],
    d_hello: ["hello"],
    d_menu: ["menu"],
    d_stress1: ["stress1"]
  }, MAIN_PAGE_DEPTH);

  connect(vm.o.d_val, splitter.i.d_val);
  connect(splitter.o.d_menu, mainMenuView.i.d_vm);
  connect(splitter.o.d_content, emptyPageView.i.d_vm);
  connect(splitter.o.d_hello, helloWorldPageView.i.d_vm);
  connect(splitter.o.d_stress1, stressTest1PageView.i.d_vm);
  connect(mainMenuView.o.d_view, view.i.d_val);
  connect(emptyPageView.o.d_view, view.i.d_val);
  connect(helloWorldPageView.o.d_view, view.i.d_val);
  connect(stressTest1PageView.o.d_view, view.i.d_val);

  return {
    i: {
      d_view: view.i.d_val,
      d_vm: vm.i.d_val
    },
    o: {
      d_view: view.o.d_val,
      d_vm: vm.o.d_val
    }
  };
}
