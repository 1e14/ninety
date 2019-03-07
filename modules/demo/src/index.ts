// tslint:disable:no-console

import {createDiffBuffer} from "gravel-core";
import {createRouter} from "gravel-routing";
import {createDomDiffApplier} from "gravel-view-dom";
import {createLocationHash} from "river-browser";
import {connect} from "river-core";
import {createMapper, createNoop} from "river-stdlib";
import {createCustomTextView} from "./nodes/CustomTextView";

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

// setting up routing table
const router = createRouter([
  /^render$/,
  /^views$/
]);
connect(hash2Path.o.d_val, router.i.d_path);

// setting up routing "table"
connect(router.o["/^views$/"], () => {
  const textView = createCustomTextView("body.childNodes.0:span");
  const textSource = createMapper(() => ({
    set: {
      content: "Hello World!"
    }
  }));

  connect(textSource.o.d_val, textView.i.vm_diff);
  connect(textView.o.v_diff, viewBuffer.i.d_diff);
  connect(textView.o.ev_click, console.log);

  // nudge
  textSource.i.d_val(null);
});
