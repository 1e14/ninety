import {connect, Node} from "1e14";
import {
  createFlameEdgeMapper,
  createFlameMapperRoot,
  createFlameSplitter,
  FlameBodyMapperIn,
  FlameBodyMapperOut
} from "flamejet";
import {createHelloWorldPageView} from "./hello-world";
import {createMainMenuView} from "./MainMenuView";
import {createModelTest1PageView} from "./model-test-1";
import {createStressTest1PageView} from "./stress-test-1";

export type In = FlameBodyMapperIn;

export type Out = FlameBodyMapperOut;

export type MainPageView = Node<In, Out>;

const MAIN_PAGE_DEPTH = 0;

export function createMainPageView(): MainPageView {
  const mainView = createFlameMapperRoot();
  const mainMenuView = createMainMenuView("childNodes.0:UL", MAIN_PAGE_DEPTH);
  const emptyPageView = createFlameEdgeMapper(() => "childNodes.1:DIV");
  const helloWorldPageView = createHelloWorldPageView("childNodes.1:DIV",
    MAIN_PAGE_DEPTH);
  const stressTest1PageView = createStressTest1PageView("childNodes.1:DIV",
    MAIN_PAGE_DEPTH);
  const modelTest1PageView = createModelTest1PageView("childNodes.1:DIV",
    MAIN_PAGE_DEPTH);
  const splitter = createFlameSplitter({
    d_content: ["content"],
    d_hello: ["hello"],
    d_menu: ["menu"],
    d_model1: ["model1"],
    d_stress1: ["stress1"]
  }, MAIN_PAGE_DEPTH);

  connect(mainView.o.d_in, splitter.i.d_val);
  connect(splitter.o.d_menu, mainMenuView.i.d_in);
  connect(splitter.o.d_content, emptyPageView.i.d_in);
  connect(splitter.o.d_hello, helloWorldPageView.i.d_in);
  connect(splitter.o.d_stress1, stressTest1PageView.i.d_in);
  connect(splitter.o.d_model1, modelTest1PageView.i.d_in);
  connect(mainMenuView.o.d_out, mainView.i.d_out);
  connect(emptyPageView.o.d_out, mainView.i.d_out);
  connect(helloWorldPageView.o.d_out, mainView.i.d_out);
  connect(stressTest1PageView.o.d_out, mainView.i.d_out);
  connect(modelTest1PageView.o.d_out, mainView.i.d_out);

  return mainView;
}
