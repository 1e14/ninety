import {applyView} from "gravel-view-dom";
import {createLocationHash} from "river-browser";
import {connect} from "river-core";

const locationHash = createLocationHash();

connect(locationHash.o.d_val, () => {
  applyView({
    del: {},
    set: {
      "body.childNodes.4,section.attributes.bar": "baz",
      "body.childNodes.4,section.classList.foo": true
    }
  });
});
