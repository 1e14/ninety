import {connect} from "river-core";
import {createPageView, PageView} from "./PageView";

describe("createPageView()", () => {
  describe("on input (d_diff)", () => {
    let node: PageView;

    beforeEach(() => {
      node = createPageView();
    });

    it("should prefix diff paths", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_diff, spy);
      node.i.d_diff({
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
