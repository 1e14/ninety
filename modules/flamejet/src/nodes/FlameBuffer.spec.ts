import {connect} from "flowcode";
import {createFlameBuffer, FlameBuffer} from "./FlameBuffer";

describe("createFlameBuffer()", () => {
  describe("on input (a_res)", function () {
    let node: FlameBuffer;

    beforeEach(() => {
      node = createFlameBuffer();
    });

    describe("after multiple inputs", () => {
      beforeEach(() => {
        node.i.d_val({
          foo: 5
        });
        node.i.d_val({
          bar: true,
          foo: null
        });
        node.i.d_val({
          bar: false,
          foo: 3
        });
      });

      it("should emit compounded flame on 'd_val'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.a_res(null, "1");
        expect(spy).toHaveBeenCalledWith({
          bar: false,
          foo: 3
        }, "1");
      });
    });

    describe("on no change", () => {
      it("should not emit on 'd_val'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.a_res(null, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
