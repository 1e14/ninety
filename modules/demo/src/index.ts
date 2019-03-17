// tslint:disable:no-console

import {createDiffBuffer, FlameDiff} from "gravel-core";
import {createRouter} from "gravel-router";
import {createDomDiffApplier} from "gravel-view-dom";
import {createDomReadyNotifier, createLocationHash} from "river-browser";
import {connect} from "river-core";
import {createMapper, createNoop} from "river-stdlib";
import {createMainPageView} from "./nodes";

// setting up bootstrapper
const domReadyNotifier = createDomReadyNotifier();

// setting up hash-based routing
const locationHash = createLocationHash();
const hash2Path = createMapper<string, string>((hash) => hash.substr(1));
connect(locationHash.o.d_val, hash2Path.i.d_val);

// setting up rendering engine
// flushes diff buffer to renderer every 10ms
const ticker = createNoop();
const viewBuffer = createDiffBuffer();
const domDiffApplier = createDomDiffApplier();
setInterval(ticker.i.d_val, 10);
connect(viewBuffer.o.d_diff, domDiffApplier.i.d_diff);
connect(ticker.o.d_val, viewBuffer.i.ev_res);

// setting up main page
const mainPageView = createMainPageView();
const mainPageVm = createMapper<any, FlameDiff>(() => ({
  del: {},
  set: {
    "page.menu.item1.text": "Hello World",
    "page.menu.item1.url": "#hello-world",
    "page.menu.item2.text": "Animated table",
    "page.menu.item2.url": "#animated-table"
  }
}));
connect(mainPageVm.o.d_val, mainPageView.i.d_vm);
connect(domReadyNotifier.o.ev_ready, mainPageVm.i.d_val);
connect(mainPageView.o.d_view, viewBuffer.i.d_diff);

// setting up routes
const ROUTE_HELLO_WORLD = /^hello-world$/;
const ROUTE_ANIMATED_TABLE = /^animated-table$/;
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
  set: {"page.hello.text": "Hello World!"}
}));
connect(helloWorldPageVm.o.d_val, mainPageView.i.d_vm);

// setting up routing table
const router = createRouter([
  ROUTE_HELLO_WORLD,
  ROUTE_ANIMATED_TABLE,
  ROUTE_REST
]);
connect(hash2Path.o.d_val, router.i.d_route);
connect(router.o[`r_${ROUTE_HELLO_WORLD}`], helloWorldPageVm.i.d_val);
connect(router.o[`r_${ROUTE_REST}`], emptyPageView.i.d_val);
