import {connect} from "river-core";
import {createDiffBuffer, DiffBuffer} from "./DiffBuffer";

describe("createDiffBuffer()", () => {
  describe("on input (ev_res)", function () {
    let node: DiffBuffer<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      node = createDiffBuffer();
    });

    describe("after multiple diffs", () => {
      beforeEach(() => {
        node.i.d_diff({
          set: {foo: 5}
        });
        node.i.d_diff({
          del: {foo: 5},
          set: {bar: true}
        });
        node.i.d_diff({
          set: {foo: 3, bar: false}
        });
      });

      it("should emit aggregated diff on 'd_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_diff, spy);
        node.i.ev_res(null, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {},
          set: {foo: 3, bar: false}
        }, "1");
      });
    });

    describe("when diff is empty", () => {
      it("should emit empty diff on 'd_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_diff, spy);
        node.i.ev_res(null, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {},
          set: {}
        }, "1");
      });
    });
  });
});
