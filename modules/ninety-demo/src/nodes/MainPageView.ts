import {createFlameSplitter} from "flamejet";
import {connect, Node} from "flowcode";
import {createSwitcher} from "flowcode-flow";
import {createMapper} from "flowcode-fp";
import {
  createLeafView,
  createRootView,
  ParentViewIn,
  ParentViewOut
} from "ninety-mvvm";
import {
  ROUTE_HELLO_WORLD,
  ROUTE_MODEL_TEST_1,
  ROUTE_STRESS_TEST_1
} from "../utils/routes";
import {createHelloWorldPageView} from "./hello-world/HelloWorldPageView";
import {createMainMenuView} from "./MainMenuView";
import {createModelTest1PageView} from "./model-test-1/ModelTest1PageView";
import {createStressTest1PageView} from "./stress-test-1/StressTest1PageView";

export type In = ParentViewIn & {
  d_route: RegExp;
};

export type Out = ParentViewOut;

export type MainPageView = Node<In, Out>;

const MAIN_PAGE_DEPTH = 0;

export function createMainPageView(): MainPageView {
  const rootView = createRootView();
  const routeStringifier = createMapper(String);
  const switcher = createSwitcher([
    String(ROUTE_HELLO_WORLD),
    String(ROUTE_MODEL_TEST_1),
    String(ROUTE_STRESS_TEST_1)
  ]);
  const mainMenuView = createMainMenuView("childNodes.0:UL", MAIN_PAGE_DEPTH);
  const emptyPageView = createLeafView(() => "childNodes.1:DIV");
  const helloWorldPageView = createHelloWorldPageView("childNodes.1:DIV",
    MAIN_PAGE_DEPTH);
  const stressTest1PageView = createStressTest1PageView("childNodes.1:DIV",
    MAIN_PAGE_DEPTH);
  const modelTest1PageView = createModelTest1PageView("childNodes.1:DIV",
    MAIN_PAGE_DEPTH);
  const splitter = createFlameSplitter({
    d_menu: ["menu"]
  }, MAIN_PAGE_DEPTH);

  connect(routeStringifier.o.d_val, switcher.i.st_pos);
  connect(rootView.o.d_vm, splitter.i.d_val);
  connect(splitter.o.d_menu, mainMenuView.i.d_vm);
  connect(splitter.o.b_d_val, switcher.i.d_val);
  connect(switcher.o.b_d_val, emptyPageView.i.d_vm);
  connect(switcher.o[String(ROUTE_HELLO_WORLD)], helloWorldPageView.i.d_vm);
  connect(switcher.o[String(ROUTE_STRESS_TEST_1)], stressTest1PageView.i.d_vm);
  connect(switcher.o[String(ROUTE_MODEL_TEST_1)], modelTest1PageView.i.d_vm);
  connect(mainMenuView.o.d_view, rootView.i.d_view);
  connect(emptyPageView.o.d_view, rootView.i.d_view);
  connect(helloWorldPageView.o.d_view, rootView.i.d_view);
  connect(stressTest1PageView.o.d_view, rootView.i.d_view);
  connect(modelTest1PageView.o.d_view, rootView.i.d_view);

  return {
    i: {
      d_route: routeStringifier.i.d_val,
      d_view: rootView.i.d_view,
      d_vm: rootView.i.d_vm
    },
    o: {
      d_view: rootView.o.d_view,
      d_vm: rootView.o.d_vm
    }
  };
}
