import {connect} from "river-core";
import {createView2, View2} from "./View2";

describe("createView2()", () => {
  describe("on input (v_diff)", () => {
    let node: View2;

    beforeEach(() => {
      const RE = /(\d+)-(\d+)/;
      node = createView2((component) => {
        const hits = RE.exec(component);
        return `childNodes.${hits[1]}:tr.childNodes.${hits[2]}:td`;
      }, 2);
    });

    it("should emit processed diff on 'v_diff'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.v_diff, spy);
      node.i.v_diff({
        del: {
          "page.table.1-3.text": null
        },
        set: {
          "page.table.2-4.text": "Foo"
        }
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        del: {
          "page.table.childNodes.1:tr.childNodes.3:td.text": null
        },
        set: {
          "page.table.childNodes.2:tr.childNodes.4:td.text": "Foo"
        }
      }, "1");
    });
  });
});
