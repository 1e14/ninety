import {setDomPath} from "gravel-dom";
import {createLocationHash} from "river-browser";
import {connect} from "river-core";

const locationHash = createLocationHash();

connect(locationHash.o.d_val, () => {
  setDomPath("body.childNodes.4.tagName", "section");
});
