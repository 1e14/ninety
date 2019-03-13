import {connect} from "river-core";
import {createDomPropertyView, DomPropertyView} from "./DomPropertyView";

describe("createDomPropertyView()", () => {
  describe("on input (vm_diff)", () => {
    let node: DomPropertyView;

    beforeEach(() => {
      node = createDomPropertyView("foo", "bar", "baz");
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
          "foo.a.baz": null
        },
        set: {
          "foo.a.baz": 5
        }
      }, "1");
    });
  });
});
