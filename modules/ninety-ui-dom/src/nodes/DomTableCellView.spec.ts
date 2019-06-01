import {connect} from "flowcode";
import {createDomTableCellView, DomTableCellView} from "./DomTableCellView";

describe("createDomTableCellView()", () => {
  describe("on input (d_out)", () => {
    let node: DomTableCellView;

    beforeEach(() => {
      node = createDomTableCellView(1);
    });

    it("should emit on 'd_out'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_view, spy);
      node.i.d_view({
        "foo.1,3.bar": "baz"
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        "foo.childNodes,1:TR,childNodes,3:TD.bar": "baz"
      }, "1");
    });
  });
});
