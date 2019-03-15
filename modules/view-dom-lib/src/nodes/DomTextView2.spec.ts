import {connect} from "river-core";
import {createDomTextView2, DomTextView2} from "./DomTextView2";

describe("createDomTextView2()", () => {
  describe("on input (vm_diff)", () => {
    let node: DomTextView2;

    beforeEach(() => {
      node = createDomTextView2( 3);
    });

    describe("on set", () => {
      it("should emit mapped vm on 'v_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.v_diff, spy);
        node.i.vm_diff({
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
        node.i.vm_diff({
          del: {},
          set: {"page.table.2-4.text": "Foo"}
        }, "1");
      });

      it("should emit mapped vm on 'v_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.v_diff, spy);
        node.i.vm_diff({
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
