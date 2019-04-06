import {connect} from "1e14";
import {createMapper} from "1e14-fp";
import {createDemuxer, createMuxer} from "1e14-mux";
import {createTicker} from "1e14-time";
import {createDiffBuffer, FlameDiff} from "flamejet";
import {createRouter} from "ninety-router";
import {createParentThread} from "ninety-webworker";
import {createMainPageView} from "./nodes";
import {generateTableData} from "./utils";

// setting up thread communication
const parentThread = createParentThread();
const parentMuxer = createMuxer(["d_view"]);
const parentDemuxer = createDemuxer(["ev_dom_ready", "d_hash_path"]);
connect(parentThread.o.d_msg, parentDemuxer.i.d_mux);
connect(parentMuxer.o.d_mux, parentThread.i.d_msg);

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
connect(parentDemuxer.o.ev_dom_ready, mainPageVm.i.d_val);

// setting up pre-rendering
const ticker = createTicker(10, true);
const diffBuffer = createDiffBuffer();
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
connect(mainPageView.o.d_view, pathNormalizer.i.d_val);
connect(pathNormalizer.o.d_val, diffBuffer.i.d_diff);
connect(ticker.o.ev_tick, diffBuffer.i.ev_res);
connect(diffBuffer.o.d_diff, parentMuxer.i.d_view);

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
      "Firehose test using a table with 1024 cells"
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
connect(parentDemuxer.o.d_hash_path, router.i.d_route);
connect(router.o[`r_${ROUTE_HELLO_WORLD}`], helloWorldPageVm.i.d_val);
connect(router.o[`r_${ROUTE_STRESS_TEST_1}`], stressTest1PageVm.i.d_val);
connect(router.o[`r_${ROUTE_STRESS_TEST_1}`], tableDataGenerator.i.d_val);
connect(router.o.d_pattern, tableRouteDetector.i.d_val);
connect(router.o[`r_${ROUTE_REST}`], emptyPageView.i.d_val);
