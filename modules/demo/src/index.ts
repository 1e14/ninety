// tslint:disable:no-console

import {createDiffBuffer} from "gravel-core";
import {createDomDiffApplier} from "gravel-view-dom";
import {createPageView} from "gravel-view-dom-lib";
import {createLocationHash} from "river-browser";
import {connect} from "river-core";
import {createMapper, createNoop} from "river-stdlib";
import {createCustomTextView} from "./nodes/CustomTextView";

const locationHash = createLocationHash();
const ticker = createNoop();
const diffBuffer = createDiffBuffer();
const domDiffApplier = createDomDiffApplier();

connect(locationHash.o.d_val, diffBuffer.i.ev_res);
connect(diffBuffer.o.d_diff, domDiffApplier.i.d_diff);
// connect(diffBuffer.o.d_diff, console.log);
setInterval(ticker.i.d_val, 10);
connect(ticker.o.d_val, diffBuffer.i.ev_res);

const pageView = createPageView();
const textView = createCustomTextView("childNodes.1:span");
const textSource = createMapper(() => "Hello World!");

connect(locationHash.o.d_val, textSource.i.d_val);
connect(textSource.o.d_val, textView.i.d_content);
connect(textView.o.d_diff, pageView.i.d_diff);
connect(textView.o.ev_click, console.log);
connect(pageView.o.d_diff, diffBuffer.i.d_diff);
