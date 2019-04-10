import {connect} from "1e14";
import {createLeafView, LeafView} from "./LeafView";

describe("createLeafView()", () => {
  describe("on input (d_vm)", () => {
    let node: LeafView;

    beforeEach(() => {
      node = createLeafView(() => "style,color");
    });

    it("should emit processed view on 'd_view'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_view, spy);
      node.i.d_vm({
        "page.table.1,3.text": null,
        "page.table.2,4.text": "Foo"
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        "page.table.1,3.style,color": null,
        "page.table.2,4.style,color": "Foo"
      }, "1");
    });
  });
});
