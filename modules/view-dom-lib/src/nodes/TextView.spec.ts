import {connect} from "river-core";
import {createTextView, TextView} from "./TextView";

describe("createTextView()", () => {
  describe("on input (vm_content)", () => {
    let node: TextView;

    beforeEach(() => {
      node = createTextView("foo");
    });

    it("should emit on 'v_diff'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.v_diff, spy);
      node.i.vm_diff({set: {content: "Hello"}}, "1");
      expect(spy).toHaveBeenCalledWith({
        set: {"foo.innerText": "Hello"}
      }, "1");
    });
  });
});
