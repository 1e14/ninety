import {connect} from "river-core";
import {createDiffBuffer, DiffBuffer} from "./DiffBuffer";

describe("createDiffBuffer()", () => {
  describe("on input (d_diff)", () => {
    let node: DiffBuffer<{ foo: number, bar: boolean }>;

    describe("when open", () => {
      beforeEach(() => {
        node = createDiffBuffer(true);
      });

      it("should forward 'd_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_diff, spy);
        const diff = {
          set: {foo: 5}
        };
        node.i.d_diff(diff, "1");
        expect(spy).toHaveBeenCalledWith(diff, "1");
      });
    });
  });

  describe("on input (st_open)", function () {
    let node: DiffBuffer<{ foo: number, bar: boolean }>;

    describe("on opening", () => {
      beforeEach(() => {
        node = createDiffBuffer(false);
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
          node.i.st_open(true, "1");
          expect(spy).toHaveBeenCalledWith({
            del: {},
            set: {foo: 3, bar: false}
          }, "1");
        });
      });
    });
  });
});
