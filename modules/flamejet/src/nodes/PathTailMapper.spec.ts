import {connect} from "1e14";
import {createPathTailMapper, PathTailMapper} from "./PathTailMapper";

describe("createPathTailMapper()", () => {
  describe("on input (d_in)", () => {
    let node: PathTailMapper;

    beforeEach(() => {
      node = createPathTailMapper(
        () => "style,color",
        (value) => value && value.toLowerCase());
    });

    it("should emit processed view on 'd_out'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_out, spy);
      node.i.d_in({
        "page.table.1,3.text": null,
        "page.table.2,4.text": "Foo"
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        "page.table.1,3.style,color": null,
        "page.table.2,4.style,color": "foo"
      }, "1");
    });
  });
});
