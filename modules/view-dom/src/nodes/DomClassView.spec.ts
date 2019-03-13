import {connect} from "river-core";
import {createDomClassView, DomClassView} from "./DomClassView";

describe("createDomClassView()", () => {
  describe("on input (vm_diff)", () => {
    let node: DomClassView;

    beforeEach(() => {
      node = createDomClassView("foo", "bar", "baz");
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
          "foo.a.classList.baz": null
        },
        set: {
          "foo.a.classList.baz": 5
        }
      }, "1");
    });
  });
});
