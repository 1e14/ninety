import {connect} from "1e14";
import {createFlameBodyMapper, FlameBodyMapper} from "./FlameBodyMapper";

describe("createFlameBodyMapper()", () => {
  describe("on input (d_in)", () => {
    let node: FlameBodyMapper;

    beforeEach(() => {
      const RE = /(\d+),(\d+)/;
      node = createFlameBodyMapper((component) => {
        const hits = RE.exec(component);
        return `childNodes,${hits[1]}:tr,childNodes,${hits[2]}:td`;
      }, 2);
    });

    it("should forward to 'd_in'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_in, spy);
      node.i.d_in({
        "page.table.1,3.text": null,
        "page.table.2,4.text": "Foo"
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        "page.table.1,3.text": null,
        "page.table.2,4.text": "Foo"
      }, "1");
    });

    describe("on subtree delete", function () {
      it("should emit subtree path on 'd_out'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_out, spy);
        node.i.d_in({
          "page.table.1,3": null
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          "page.table.childNodes,1:tr,childNodes,3:td": null
        }, "1");
      });
    });
  });

  describe("on input (d_out)", () => {
    let node: FlameBodyMapper;

    beforeEach(() => {
      const RE = /(\d+),(\d+)/;
      node = createFlameBodyMapper((component) => {
        const hits = RE.exec(component);
        return `childNodes,${hits[1]}:tr,childNodes,${hits[2]}:td`;
      }, 2);
    });

    it("should emit processed view on 'd_out'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_out, spy);
      node.i.d_out({
        "page.table.1,3.text": null,
        "page.table.2,4.text": "Foo"
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        "page.table.childNodes,1:tr,childNodes,3:td.text": null,
        "page.table.childNodes,2:tr,childNodes,4:td.text": "Foo"
      }, "1");
    });
  });
});
