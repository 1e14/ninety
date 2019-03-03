import {createDomViewApplier} from "gravel-view-dom";
import {createLocationHash} from "river-browser";
import {connect} from "river-core";

const locationHash = createLocationHash();
const domViewApplier = createDomViewApplier();

connect(locationHash.o.d_val, () => {
  domViewApplier.i.d_diff({
    set: {
      "body.childNodes.1:section": null,
      "body.childNodes.4:section.attributes.bar": "baz",
      "body.childNodes.4:section.childNodes.0:span.innerText": "Hello World!",
      "body.childNodes.4:section.childNodes.0:span.style.color": "red",
      "body.childNodes.4:section.classList.foo": true,
      "body.childNodes.4:section.style.backgroundColor": "green",
      "body.childNodes.4:section.style.height": "100px"
    }
  });
  domViewApplier.i.d_diff({
    del: {
      "body.childNodes.1:section": null,
      "body.childNodes.4:section.classList.foo": null
    },
    set: {
      "body.childNodes.2:div.attributes.id": "quux",
      "body.childNodes.4:section.attributes.bar": "BAZ"
    }
  });
});
