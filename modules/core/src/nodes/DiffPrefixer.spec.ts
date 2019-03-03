import {connect} from "river-core";
import {createDiffPrefixer, DiffPrefixer} from "./DiffPrefixer";

describe("createDiffPrefixer()", () => {
  describe("on input (d_diff)", () => {
    let node: DiffPrefixer;

    beforeEach(() => {
      node = createDiffPrefixer("baz.");
    });

    it("should emit on 'd_diff'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_diff, spy);
      node.i.d_diff({
        del: {
          bar: null
        },
        set: {
          foo: 5
        }
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        del: {
          "baz.bar": null
        },
        set: {
          "baz.foo": 5
        }
      }, "1");
    });

    describe("when 'set' is missing", () => {
      it("should emit on 'd_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_diff, spy);
        node.i.d_diff({
          del: {
            bar: null
          }
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {
            "baz.bar": null
          },
          set: {}
        }, "1");
      });
    });

    describe("when 'del' is missing", function () {
      it("should emit on 'd_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_diff, spy);
        node.i.d_diff({
          set: {
            foo: 5
          }
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {},
          set: {
            "baz.foo": 5
          }
        }, "1");
      });
    });
  });
});
