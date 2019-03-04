import {connect} from "river-core";
import {createPageView, PageView} from "./PageView";

describe("createPageView()", () => {
  describe("on input (v_diff)", () => {
    let node: PageView;

    beforeEach(() => {
      node = createPageView();
    });

    it("should prefix diff paths", () => {
      const spy = jasmine.createSpy();
      connect(node.o.v_diff, spy);
      node.i.v_diff({
        del: {
          baz: null
        },
        set: {
          foo: "bar"
        }
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        del: {
          "body.baz": null
        },
        set: {
          "body.foo": "bar"
        }
      }, "1");
    });
  });
});
