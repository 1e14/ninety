import {connect} from "1e14";
import * as utils from "../utils";
import {createFrameRenderer, FrameRenderer} from "./FrameRenderer";

describe("createFrameRenderer()", () => {
  const window = <any>global;

  beforeEach(() => {
    window.requestAnimationFrame = (cb) => cb();
    window.performance = {
      now() {
        return 0;
      }
    };
    window.window = window;
  });

  afterEach(() => {
    delete window.requestAnimationFrame;
    delete window.performance;
    delete window.window;
  });

  describe("on input (d_frame)", () => {
    let node: FrameRenderer;

    beforeEach(() => {
      node = createFrameRenderer();
    });

    it("should schedule animation frame", () => {
      const spy = spyOn(window, "requestAnimationFrame");
      node.i.d_frame({
        "foo.bar": 1,
        "foo.baz": 2
      }, "1");
      expect(spy).toHaveBeenCalled();
    });

    it("should invoke applyViewToDom()", () => {
      const spy = spyOn(utils, "applyViewToDom");
      node.i.d_frame({
        "foo.bar": 1,
        "foo.baz": 2
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        "foo.bar": 1,
        "foo.baz": 2
      });
    });

    it("should emit duration on 'd_dur'", () => {
      spyOn(window.performance, "now").and.returnValues(3, 8);
      spyOn(utils, "applyViewToDom");
      spyOn(window, "requestAnimationFrame").and.callThrough();
      const spy = jasmine.createSpy();
      connect(node.o.d_dur, spy);
      node.i.d_frame({
        "foo.bar": 1,
        "foo.baz": 2
      }, "1");
      expect(spy).toHaveBeenCalledWith(5, "1");
    });
  });
});
