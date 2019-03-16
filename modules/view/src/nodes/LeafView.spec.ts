import {connect} from "river-core";
import {createLeafView, LeafView} from "./LeafView";

describe("createLeafView()", () => {
  describe("on input (d_vm)", () => {
    let node: LeafView;

    beforeEach(() => {
      node = createLeafView(() => "style,color");
    });

    describe("on 'get'", () => {
      beforeEach(() => {
        node.i.d_vm({
          del: {},
          set: {
            "page.table.1,3.text": "Bar",
            "page.table.2,4.text": "Foo"
          }
        }, "1");
      });

      describe("on exact match", () => {
        it("should emit contents on 'd_vm'", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_view, spy);
          node.i.d_vm({
            get: {
              "page.table.1,3.text": null,
              "page.table.3,2.text": null
            }
          }, "1");
          expect(spy).toHaveBeenCalledWith({
            del: {},
            set: {
              "page.table.1,3.style,color": "Bar"
            }
          }, "1");
        });
      });

      describe("on prefix match", () => {
        beforeEach(() => {
          node.i.d_vm({
            del: {},
            set: {
              "page.other.text": "Quux"
            }
          }, "1");
        });

        it("should emit all matching paths on 'd_vm'", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_view, spy);
          node.i.d_vm({
            get: {
              "page.table": null
            }
          }, "1");
          expect(spy).toHaveBeenCalledWith({
            del: {},
            set: {
              "page.table.1,3.style,color": "Bar",
              "page.table.2,4.style,color": "Foo"
            }
          }, "1");
        });
      });

      describe("on empty results", () => {
        it("should not emit on 'd_vm'", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_vm, spy);
          node.i.d_vm({
            get: {
              "page.table.3,2.text": null
            }
          }, "1");
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });

    describe("on 'set' & 'del'", () => {
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
            "page.table.1,3.style,color": null
          },
          set: {
            "page.table.2,4.style,color": "Foo"
          }
        }, "1");
      });
    });
  });
});
