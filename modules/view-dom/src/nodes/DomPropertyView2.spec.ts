import {connect} from "river-core";
import {createDomPropertyView2, DomPropertyView2} from "./DomPropertyView2";

describe("createDomPropertyView2()", () => {
  describe("on input (vm_diff)", () => {
    describe("for leaf views", () => {
      let node: DomPropertyView2;

      beforeEach(() => {
        node = createDomPropertyView2("innerText", 3);
      });

      it("should emit on 'v_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.v_diff, spy);
        node.i.vm_diff({
          del: {
            "page.table.1-3.text": null
          },
          set: {
            "page.table.2-4.text": "Foo"
          }
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {
            "page.table.1-3.innerText": null
          },
          set: {
            "page.table.2-4.innerText": "Foo"
          }
        }, "1");
      });
    });

    describe("for parent views", () => {
      let node: DomPropertyView2;

      beforeEach(() => {
        node = createDomPropertyView2("style.color", 1);
      });

      it("should emit on 'v_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.v_diff, spy);
        node.i.vm_diff({
          del: {
            "page.table.1-3.text": null
          },
          set: {
            "page.table.2-4.text": "Foo"
          }
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {
            "page.style.color": null
          },
          set: {
            "page.style.color": "Foo"
          }
        }, "1");
      });
    });
  });
});
