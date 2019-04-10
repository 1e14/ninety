import {connect} from "1e14";
import {createDomClassView, DomClassView} from "./DomClassView";

describe("createDomClassView()", () => {
  describe("on input (d_vm)", () => {
    let node: DomClassView;

    beforeEach(() => {
      node = createDomClassView("foo");
    });

    it("should emit on 'd_view'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_view, spy);
      node.i.d_vm({
        "bar.baz": 5
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        "bar.classList,foo": 5
      }, "1");
    });
  });
});
