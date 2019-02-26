import {applyView} from "gravel-dom";
import {createLocationHash} from "river-browser";
import {connect} from "river-core";

const locationHash = createLocationHash();

connect(locationHash.o.d_val, () => {
  applyView({
    del: {},
    set: {
      "body.childNodes.4.attributes.bar": "baz",
      "body.childNodes.4.classList.foo": true,
      "body.childNodes.4.tagName": "section"
    }
  });
});
