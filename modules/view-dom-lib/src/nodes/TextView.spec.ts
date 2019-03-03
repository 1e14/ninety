import {connect} from "river-core";
import {createTextView, TextView} from "./TextView";

describe("createTextView()", () => {
  describe("on input (d_content)", () => {
    let node: TextView;

    beforeEach(() => {
      node = createTextView("foo");
    });

    it("should emit on 'd_diff'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_diff, spy);
      node.i.d_content("Hello", "1");
      expect(spy).toHaveBeenCalledWith({
        set: {"foo.innerText": "Hello"}
      }, "1");
    });
  });
});
