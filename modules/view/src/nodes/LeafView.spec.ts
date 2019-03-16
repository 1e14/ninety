import {connect} from "river-core";
import {createLeafView, LeafView} from "./LeafView";

describe("createLeafView()", () => {
  describe("on input (d_vm)", () => {
    let node: LeafView;

    beforeEach(() => {
      node = createLeafView(() => "style,color", 2);
    });

    describe("when 'get' is present", () => {
      beforeEach(() => {
        node.i.d_vm({
          del: {},
          set: {
            "page.table.1,3.text": "Bar",
            "page.table.2,4.text": "Foo"
          }
        }, "1");
      });

      it("should emit contents on 'd_vm'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_vm, spy);
        node.i.d_vm({
          del: {},
          get: {
            "page.table.1,3.text": "Bar",
            "page.table.3,2.text": "Baz"
          },
          set: {}
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {},
          set: {
            "page.table.1,3.text": "Bar"
          }
        }, "1");
      });
    });

    describe("when 'set' and 'del' are present", () => {
      it("should emit processed diff on 'd_view'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_view, spy);
        node.i.d_vm({
          del: {
            "page.table.1,3.text": null
          },
          set: {
            "page.table.2,4.text": "Foo"
          }
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {
            "page.table.style,color": null
          },
          set: {
            "page.table.style,color": "Foo"
          }
        }, "1");
      });
    });
  });
});
