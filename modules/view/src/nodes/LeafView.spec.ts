import {connect} from "river-core";
import {createLeafView, LeafView} from "./LeafView";

describe("createLeafView()", () => {
  describe("on input (ev_smp)", () => {
    let node: LeafView;

    beforeEach(() => {
      node = createLeafView(() => "style,color", 2);
      node.i.vm_diff({
        del: {},
        set: {
          "page.table.1-3.text": "Bar",
          "page.table.2-4.text": "Foo"
        }
      }, "1");
    });

    it("should emit matching contents on 'v_diff'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.v_diff, spy);
      node.i.ev_smp({
        "page.table.1-3.text": null,
        "page.table.3-2.text": null
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        del: {},
        set: {
          "page.table.1-3.text": "Bar"
        }
      }, "1");
    });
  });

  describe("on input (vm_diff)", () => {
    let node: LeafView;

    beforeEach(() => {
      node = createLeafView(() => "style,color", 2);
    });

    it("should emit processed diff on 'v_diff'", () => {
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
          "page.table.style,color": null
        },
        set: {
          "page.table.style,color": "Foo"
        }
      }, "1");
    });
  });
});
