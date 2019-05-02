import {connect} from "1e14";
import {createDomListItemView, DomListItemView} from "./DomListItemView";

describe("createDomListItemView()", () => {
  describe("on input (d_out)", () => {
    let node: DomListItemView;

    beforeEach(() => {
      node = createDomListItemView(1);
    });

    it("should emit on 'd_out'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_view, spy);
      node.i.d_view({
        "foo.1.bar": "baz"
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        "foo.childNodes,1:LI.bar": "baz"
      }, "1");
    });
  });
});
