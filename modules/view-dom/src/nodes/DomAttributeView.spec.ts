import {connect} from "river-core";
import {createDomAttributeView, DomAttributeView} from "./DomAttributeView";

describe("createDomAttributeView()", () => {
  describe("on input (vm_diff)", () => {
    let node: DomAttributeView;

    beforeEach(() => {
      node = createDomAttributeView("foo", "bar", "baz");
    });

    it("should emit on 'd_diff'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.v_diff, spy);
      node.i.vm_diff({
        del: {
          "a.bar": null
        },
        set: {
          "a.bar": 5
        }
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        del: {
          "foo.a.attributes.baz": null
        },
        set: {
          "foo.a.attributes.baz": 5
        }
      }, "1");
    });
  });
});
