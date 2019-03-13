import {connect} from "river-core";
import {createDomStyleView, DomStyleView} from "./DomStyleView";

describe("createDomStyleView()", () => {
  describe("on input (vm_diff)", () => {
    let node: DomStyleView;

    beforeEach(() => {
      node = createDomStyleView("foo", "bar", "baz");
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
          "foo.a.style.baz": null
        },
        set: {
          "foo.a.style.baz": 5
        }
      }, "1");
    });
  });
});
