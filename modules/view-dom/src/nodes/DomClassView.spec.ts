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
        del: {
          "bar.baz": null
        },
        set: {
          "bar.baz": 5
        }
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        del: {
          "bar.classList,foo": null
        },
        set: {
          "bar.classList,foo": 5
        }
      }, "1");
    });
  });
});
