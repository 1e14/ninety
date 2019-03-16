import {connect} from "river-core";
import {createParentView, ParentView} from "./ParentView";

describe("createParentView()", () => {
  describe("on input (d_vm)", () => {
    let node: ParentView;

    beforeEach(() => {
      const RE = /(\d+),(\d+)/;
      node = createParentView((component) => {
        const hits = RE.exec(component);
        return `childNodes,${hits[1]}:tr,childNodes,${hits[2]}:td`;
      }, 2);
    });

    describe("on matching VM path in 'get'", () => {
      it("should emit del on 'd_view'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_view, spy);
        node.i.d_vm({
          get: {
            "page.table.1,3": null
          }
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {
            "page.table.childNodes,1:tr,childNodes,3:td": null
          },
          set: {}
        }, "1");
      });
    });

    it("should forward to 'd_vm'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_vm, spy);
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
          "page.table.1,3.text": null
        },
        set: {
          "page.table.2,4.text": "Foo"
        }
      }, "1");
    });
  });

  describe("on input (d_view)", () => {
    let node: ParentView;

    beforeEach(() => {
      const RE = /(\d+),(\d+)/;
      node = createParentView((component) => {
        const hits = RE.exec(component);
        return `childNodes,${hits[1]}:tr,childNodes,${hits[2]}:td`;
      }, 2);
    });

    it("should emit processed diff on 'd_view'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_view, spy);
      node.i.d_view({
        del: {
          "page.table.1,3.text": null
        },
        set: {
          "page.table.2,4.text": "Foo"
        }
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        del: {
          "page.table.childNodes,1:tr,childNodes,3:td.text": null
        },
        set: {
          "page.table.childNodes,2:tr,childNodes,4:td.text": "Foo"
        }
      }, "1");
    });
  });
});
