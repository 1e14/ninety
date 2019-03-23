import {connect} from "1e14";
import {createMapper} from "1e14-fp";
import {createTicker} from "1e14-time";
import {
  createDiffBuffer,
  createDomDiffApplier,
  createDomReadyNotifier,
  createLocationHash,
  createRouter,
  FlameDiff
} from "ninety";
import {createMainPageView} from "./nodes";
import {generateTableData} from "./utils";

// setting up bootstrapper
const domReadyNotifier = createDomReadyNotifier();

// setting up hash-based routing
const locationHash = createLocationHash();
const hash2Path = createMapper<string, string>((hash) => hash.substr(1));
connect(locationHash.o.d_val, hash2Path.i.d_val);

// setting up rendering engine
// flushes diff buffer to renderer every 10ms
const ticker = createTicker(10, true);
const viewBuffer = createDiffBuffer();
// TODO: Move out to a node.
const pathNormalizer = createMapper<FlameDiff, FlameDiff>((diff) => {
  const set = {};
  const del = {};
  const viewSet = diff.set;
  const viewDel = diff.del;
  for (const path in viewSet) {
    set[path.replace(/,/g, ".")] = viewSet[path];
  }
  for (const path in viewDel) {
    del[path.replace(/,/g, ".")] = null;
  }
  return {set, del};
});
const domDiffApplier = createDomDiffApplier();
connect(viewBuffer.o.d_diff, pathNormalizer.i.d_val);
connect(pathNormalizer.o.d_val, domDiffApplier.i.d_diff);
connect(ticker.o.ev_tick, viewBuffer.i.ev_res);

// setting up main page
const mainPageView = createMainPageView();
const mainPageVm = createMapper<any, FlameDiff>(() => ({
  del: {},
  set: {
    "page.menu.0.link.text": "Hello world",
    "page.menu.0.link.url": "#hello-world",
    "page.menu.1.link.text": "Stress test (table)",
    "page.menu.1.link.url": "#stress-test-1"
  }
}));
connect(mainPageVm.o.d_val, mainPageView.i.d_vm);
connect(domReadyNotifier.o.ev_ready, mainPageVm.i.d_val);
connect(mainPageView.o.d_view, viewBuffer.i.d_diff);

// setting up routes
const ROUTE_HELLO_WORLD = /^hello-world$/;
const ROUTE_STRESS_TEST_1 = /^stress-test-1$/;
const ROUTE_REST = /^.*$/;

// "page" 0: no content
const emptyPageView = createMapper(() => ({
  del: {"page.content": null},
  set: {}
}));
connect(emptyPageView.o.d_val, mainPageView.i.d_vm);

// "page" 1: "hello world"
const helloWorldPageVm = createMapper(() => ({
  del: {"page.hello": null},
  set: {"page.hello.caption.text": "Hello World!"}
}));
connect(helloWorldPageVm.o.d_val, mainPageView.i.d_vm);

// "page" 2: stress test with large table
const stressTest1PageVm = createMapper(() => ({
  del: {"page.stress1": null},
  set: {
    "page.stress1.buttons.start.click": null,
    "page.stress1.buttons.start.text": "Start",
    "page.stress1.buttons.stop.click": null,
    "page.stress1.buttons.stop.text": "Stop",
    "page.stress1.desc.text":
      "Fire hose test using a table with 1024 cells"
  }
}));
const tableTicker = createTicker(100, true);
const tableDataGenerator = createMapper<any, FlameDiff>(
  () => generateTableData("page.stress1.table", 32, 32));
connect(tableTicker.o.ev_tick, tableDataGenerator.i.d_val);
connect(tableDataGenerator.o.d_val, mainPageView.i.d_vm);
connect(stressTest1PageVm.o.d_val, mainPageView.i.d_vm);
const tableRouteDetector = createMapper<RegExp, boolean>(
  (pattern) => pattern === ROUTE_STRESS_TEST_1);
connect(tableRouteDetector.o.d_val, tableTicker.i.st_ticking);

// setting up routing table
const router = createRouter([
  ROUTE_HELLO_WORLD,
  ROUTE_STRESS_TEST_1,
  ROUTE_REST
]);
connect(hash2Path.o.d_val, router.i.d_route);
connect(router.o[`r_${ROUTE_HELLO_WORLD}`], helloWorldPageVm.i.d_val);
connect(router.o[`r_${ROUTE_STRESS_TEST_1}`], stressTest1PageVm.i.d_val);
connect(router.o[`r_${ROUTE_STRESS_TEST_1}`], tableDataGenerator.i.d_val);
connect(router.o.d_pattern, tableRouteDetector.i.d_val);
connect(router.o[`r_${ROUTE_REST}`], emptyPageView.i.d_val);
