import {connect} from "1e14";
import {createDomTextView, DomTextView} from "./DomTextView";

describe("createDomTextView()", () => {
  describe("on input (d_in)", () => {
    let node: DomTextView;

    beforeEach(() => {
      node = createDomTextView((component) => {
        const hits = /(\d+),(\d+)/.exec(component);
        return `childNodes,${hits[1]}:TR,childNodes,${hits[2]}:TD`;
      }, 2);
    });

    describe("on set", () => {
      it("should emit mapped vm on 'd_out'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_view, spy);
        node.i.d_vm({
          "page.table.2,4.text": "Foo"
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          "page.table.childNodes,2:TR,childNodes,4:TD.innerText": "Foo"
        }, "1");
      });
    });

    describe("on del", () => {
      it("should emit mapped vm on 'd_out'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_view, spy);
        node.i.d_vm({
          "page.table.2,4.text": null
        }, "2");
        expect(spy).toHaveBeenCalledWith({
          "page.table.childNodes,2:TR,childNodes,4:TD.innerText": null
        }, "2");
      });
    });
  });
});
