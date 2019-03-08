// tslint:disable:no-console

import {createDiffBuffer} from "gravel-core";
import {createRouter} from "gravel-routing";
import {createDomDiffApplier} from "gravel-view-dom";
import {createDomLinkView} from "gravel-view-dom-lib";
import {createLocationHash} from "river-browser";
import {connect} from "river-core";
import {createMapper, createNoop} from "river-stdlib";
import {createCustomTextView} from "./nodes/CustomTextView";
import {createSimpleTableView} from "./nodes/SimpleTableView";
import {generateTableData} from "./utils";

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

const ROOT_PATH = "body";

// menu
const MENU_PATH = `${ROOT_PATH}.childNodes.0:ul`;
const LINK_PATH = "childNodes.0:a";
const link1 = createDomLinkView(`${MENU_PATH}.childNodes.0:li.${LINK_PATH}`, {
  content: "Custom text",
  url: "#custom-text"
});
const link2 = createDomLinkView(`${MENU_PATH}.childNodes.1:li.${LINK_PATH}`, {
  content: "Table with numbers",
  url: "#table"
});
connect(link1.o.v_diff, viewBuffer.i.d_diff);
connect(link2.o.v_diff, viewBuffer.i.d_diff);

// "page" 1: custom text field
const textView = createCustomTextView(`${ROOT_PATH}.childNodes.1:span`, {
  content: "Hello World!"
});
connect(textView.o.v_diff, viewBuffer.i.d_diff);
connect(textView.o.ev_click, console.log);

// "page" 2: table w/ numbers
const tableView = createSimpleTableView(`${ROOT_PATH}.childNodes.1:table`);
tableView.i.vm_diff(generateTableData(20, 20));
connect(tableView.o.v_diff, viewBuffer.i.d_diff);

// setting up routing table
const ROUTE_CUSTOM_TEXT = /^custom-text$/;
const ROUTE_TABLE = /^table$/;
const ROUTE_REST = /^.*$/;

const router = createRouter([
  ROUTE_CUSTOM_TEXT,
  ROUTE_TABLE,
  ROUTE_REST
]);
connect(hash2Path.o.d_val, router.i.d_path);
connect(router.o[String(ROUTE_CUSTOM_TEXT)], textView.i.ev_smp);
connect(router.o[String(ROUTE_TABLE)], tableView.i.ev_smp);
connect(router.o[String(ROUTE_REST)], link1.i.ev_smp);
connect(router.o[String(ROUTE_REST)], link2.i.ev_smp);
