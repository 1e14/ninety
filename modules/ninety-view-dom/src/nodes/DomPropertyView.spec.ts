import {connect} from "1e14";
import {createDomPropertyView, DomPropertyView} from "./DomPropertyView";

describe("createDomPropertyView()", () => {
  describe("on input (d_vm)", () => {
    let node: DomPropertyView;

    beforeEach(() => {
      node = createDomPropertyView("innerText");
    });

    it("should emit on 'd_view'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_view, spy);
      node.i.d_vm({
        "page.table.1-3.text": null,
        "page.table.2-4.text": "Foo"
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        "page.table.1-3.innerText": null,
        "page.table.2-4.innerText": "Foo"
      }, "1");
    });
  });
});
