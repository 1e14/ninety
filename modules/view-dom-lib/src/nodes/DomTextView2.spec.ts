import {connect} from "river-core";
import {createDomTextView2, DomTextView2} from "./DomTextView2";

describe("createDomTextView2()", () => {
  describe("on input (d_vm)", () => {
    let node: DomTextView2;

    beforeEach(() => {
      node = createDomTextView2();
    });

    describe("on set", () => {
      it("should emit mapped vm on 'd_view'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_view, spy);
        node.i.d_vm({
          del: {},
          set: {"page.table.2-4.text": "Foo"}
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {},
          set: {"page.table.2-4.innerText": "Foo"}
        }, "1");
      });
    });

    describe("on del", () => {
      beforeEach(() => {
        node.i.d_vm({
          del: {},
          set: {"page.table.2-4.text": "Foo"}
        }, "1");
      });

      it("should emit mapped vm on 'd_view'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_view, spy);
        node.i.d_vm({
          del: {"page.table.2-4.text": null},
          set: {}
        }, "2");
        expect(spy).toHaveBeenCalledWith({
          del: {"page.table.2-4.innerText": null},
          set: {}
        }, "2");
      });
    });
  });
});
