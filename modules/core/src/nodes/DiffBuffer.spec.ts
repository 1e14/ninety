import {connect} from "1e14";
import {createDiffBuffer, DiffBuffer} from "./DiffBuffer";

describe("createDiffBuffer()", () => {
  describe("on input (ev_res)", function () {
    let node: DiffBuffer;

    beforeEach(() => {
      node = createDiffBuffer();
    });

    describe("after multiple diffs", () => {
      beforeEach(() => {
        node.i.d_diff({
          del: {},
          set: {foo: 5}
        });
        node.i.d_diff({
          del: {foo: null},
          set: {bar: true}
        });
        node.i.d_diff({
          del: {},
          set: {foo: 3, bar: false}
        });
      });

      it("should emit compounded diff on 'd_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_diff, spy);
        node.i.ev_res(null, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {},
          set: {foo: 3, bar: false}
        }, "1");
      });
    });

    describe("on no change", () => {
      it("should not emit on 'd_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_diff, spy);
        node.i.ev_res(null, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
