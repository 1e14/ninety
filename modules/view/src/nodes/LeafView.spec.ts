import {connect} from "river-core";
import {createLeafView, LeafView} from "./LeafView";

describe("createLeafView()", () => {
  describe("on input (v_diff)", () => {
    let node: LeafView;

    beforeEach(() => {
      node = createLeafView(() => "style,color", 2);
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
          "page.table.style,color": null
        },
        set: {
          "page.table.style,color": "Foo"
        }
      }, "1");
    });
  });
});
