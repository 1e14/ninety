import * as utils from "../utils";
import {createDomViewApplier, DomViewApplier} from "./DomViewApplier";

const window = <any>global;

beforeEach(() => {
  window.requestAnimationFrame = (cb) => cb();
});

afterEach(() => {
  delete window.requestAnimationFrame;
});

describe("createDomViewApplier()", () => {
  it("should be singleton", () => {
    expect(createDomViewApplier()).toBe(createDomViewApplier());
  });

  describe("on input (d_diff)", () => {
    let node: DomViewApplier;

    beforeEach(() => {
      node = createDomViewApplier();
    });

    it("should invoke applyDomView()", () => {
      spyOn(utils, "applyDomView");
      const diff = {
        set: {
          "body.childNodes.1:div.classList.foo": true
        }
      };
      node.i.d_diff(diff, "1");
      expect(utils.applyDomView).toHaveBeenCalledWith(diff);
    });
  });
});
