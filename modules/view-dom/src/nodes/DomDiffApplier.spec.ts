import * as utils from "../utils";
import {createDomDiffApplier, DomDiffApplier} from "./DomDiffApplier";

const window = <any>global;

beforeEach(() => {
  window.requestAnimationFrame = (cb) => cb();
});

afterEach(() => {
  delete window.requestAnimationFrame;
});

describe("createDomDiffApplier()", () => {
  it("should be singleton", () => {
    expect(createDomDiffApplier()).toBe(createDomDiffApplier());
  });

  describe("on input (d_diff)", () => {
    let node: DomDiffApplier;

    beforeEach(() => {
      node = createDomDiffApplier();
    });

    it("should invoke applyDomDiff()", () => {
      spyOn(utils, "applyDomDiff");
      const diff = {
        set: {
          "body.childNodes.1:div.classList.foo": true
        }
      };
      node.i.d_diff(diff, "1");
      expect(utils.applyDomDiff).toHaveBeenCalledWith(diff);
    });
  });
});
