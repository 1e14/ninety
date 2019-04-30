import {connect} from "1e14";
import {createDomPropertyView, DomPropertyView} from "./DomPropertyView";

describe("createDomPropertyView()", () => {
  describe("on input (d_in)", () => {
    let node: DomPropertyView;

    beforeEach(() => {
      node = createDomPropertyView("innerText");
    });

    it("should emit on 'd_out'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_out, spy);
      node.i.d_in({
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
