import {connect} from "1e14";
import {createDomListItemView, DomListItemView} from "./DomListItemView";

describe("createDomListItemView()", () => {
  describe("on input (d_view)", () => {
    let node: DomListItemView;

    beforeEach(() => {
      node = createDomListItemView(1);
    });

    it("should emit on 'd_view'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_view, spy);
      node.i.d_view({
        del: {
          "foo.1.bar": null
        },
        set: {
          "foo.1.bar": "baz"
        }
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        del: {
          "foo.childNodes,1:LI.bar": null
        },
        set: {
          "foo.childNodes,1:LI.bar": "baz"
        }
      }, "1");
    });
  });
});
