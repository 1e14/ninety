import {connect} from "1e14";
import * as utils from "../utils";
import {createFrameRenderer, FrameRenderer} from "./FrameRenderer";

describe("createFrameRenderer()", () => {
  const window = <any>global;

  beforeEach(() => {
    window.requestAnimationFrame = (cb) => cb();
    window.window = window;
  });

  afterEach(() => {
    delete window.requestAnimationFrame;
    delete window.window;
  });

  describe("on input (d_diff)", () => {
    let node: FrameRenderer;

    beforeEach(() => {
      node = createFrameRenderer();
    });

    it("should schedule animation frame", () => {
      const spy = spyOn(window, "requestAnimationFrame");
      node.i.d_diff({
        del: {},
        set: {
          "foo.bar": 1,
          "foo.baz": 2
        }
      }, "1");
      expect(spy).toHaveBeenCalled();
    });

    it("should invoke applyDomDiff()", () => {
      const spy = spyOn(utils, "applyDomDiff");
      node.i.d_diff({
        del: {},
        set: {
          "foo.bar": 1,
          "foo.baz": 2
        }
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        del: {},
        set: {
          "foo.bar": 1,
          "foo.baz": 2
        }
      });
    });

    describe("when diff is null", () => {
      it("should not schedule animation frame", () => {
        const spy = spyOn(window, "requestAnimationFrame");
        node.i.d_diff(null, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
