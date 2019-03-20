import {connect} from "1e14";
import {createDomAttributeView, DomAttributeView} from "./DomAttributeView";

describe("createDomAttributeView()", () => {
  describe("on input (d_vm)", () => {
    let node: DomAttributeView;

    beforeEach(() => {
      node = createDomAttributeView("foo");
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
          "bar.attributes,foo": null
        },
        set: {
          "bar.attributes,foo": 5
        }
      }, "1");
    });
  });
});
