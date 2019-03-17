import {connect} from "river-core";
import {createDomTextView, DomTextView} from "./DomTextView";

describe("createDomTextView()", () => {
  describe("on input (d_vm)", () => {
    let node: DomTextView;

    beforeEach(() => {
      node = createDomTextView((component) => {
        const hits = /(\d+),(\d+)/.exec(component);
        return `childNodes,${hits[1]}:tr,childNodes,${hits[2]}:td`;
      }, 2);
    });

    describe("on set", () => {
      it("should emit mapped vm on 'd_view'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_view, spy);
        node.i.d_vm({
          del: {},
          set: {"page.table.2,4.text": "Foo"}
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {},
          set: {"page.table.childNodes,2:tr,childNodes,4:td.innerText": "Foo"}
        }, "1");
      });
    });

    describe("on del", () => {
      it("should emit mapped vm on 'd_view'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_view, spy);
        node.i.d_vm({
          del: {"page.table.2,4.text": null},
          set: {}
        }, "2");
        expect(spy).toHaveBeenCalledWith({
          del: {"page.table.childNodes,2:tr,childNodes,4:td.innerText": null},
          set: {}
        }, "2");
      });
    });
  });
});
