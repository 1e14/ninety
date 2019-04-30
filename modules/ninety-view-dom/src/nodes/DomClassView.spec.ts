import {connect} from "1e14";
import {createDomClassView, DomClassView} from "./DomClassView";

describe("createDomClassView()", () => {
  describe("on input (d_in)", () => {
    let node: DomClassView;

    beforeEach(() => {
      node = createDomClassView("foo");
    });

    it("should emit on 'd_out'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_out, spy);
      node.i.d_in({
        "bar.baz": 5
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        "bar.classList,foo": 5
      }, "1");
    });
  });
});
