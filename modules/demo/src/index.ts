import {createDiffBuffer} from "gravel-core";
import {createDomDiffApplier} from "gravel-view-dom";
import {createPageView, createTextView} from "gravel-view-dom-lib";
import {createLocationHash} from "river-browser";
import {connect} from "river-core";
import {createMapper, createNoop} from "river-stdlib";

const locationHash = createLocationHash();
const ticker = createNoop();
const diffBuffer = createDiffBuffer();
const domDiffApplier = createDomDiffApplier();

connect(locationHash.o.d_val, diffBuffer.i.ev_res);
connect(diffBuffer.o.d_diff, domDiffApplier.i.d_diff);
setInterval(ticker.i.d_val, 10);
connect(ticker.o.d_val, diffBuffer.i.ev_res);

const pageView = createPageView();
const textView = createTextView("childNodes.1");
const textSource = createMapper(() => "Hello World!");

connect(locationHash.o.d_val, textSource.i.d_val);
connect(textSource.o.d_val, textView.i.d_content);
connect(textView.o.d_diff, pageView.i.d_diff);
connect(pageView.o.d_diff, diffBuffer.i.d_diff);

// diffBuffer.i.d_diff({
//   set: {
//     "body.childNodes.1:section": null,
//     "body.childNodes.4:section.attributes.bar": "baz",
//     "body.childNodes.4:section.childNodes.0:span.innerText": "Hello World!",
//     "body.childNodes.4:section.childNodes.0:span.style.color": "red",
//     "body.childNodes.4:section.classList.foo": true,
//     "body.childNodes.4:section.style.backgroundColor": "green",
//     "body.childNodes.4:section.style.height": "100px"
//   }
// });
//
// diffBuffer.i.d_diff({
//   del: {
//     "body.childNodes.1:section": null,
//     "body.childNodes.4:section.classList.foo": null
//   },
//   set: {
//     "body.childNodes.2:div.attributes.id": "quux",
//     "body.childNodes.4:section.attributes.bar": "BAZ"
//   }
// });
