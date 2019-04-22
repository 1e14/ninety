import {connect} from "1e14";
import {createFlameThrottler, FlameThrottler} from "./FlameThrottler";

describe("createFlameThrottler()", () => {
  describe("on input (d_val)", () => {
    let node: FlameThrottler;

    beforeEach(() => {
      node = createFlameThrottler(2);
    });

    it("should emit buffer size on 'd_size'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_size, spy);
      node.i.d_val({
        "foo": null,
        "foo.bar": 1,
        "foo.baz": 2
      }, "1");
      expect(spy).toHaveBeenCalledWith(3, "1");
    });

    describe("when buffer is no longer empty", () => {
      it("should emit on 'ev_load'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.ev_load, spy);
        node.i.d_val({
          "foo": null,
          "foo.bar": 1,
          "foo.baz": 2
        }, "1");
        expect(spy).toHaveBeenCalledWith(null, "1");
      });
    });

    describe("when nonzero buffer size changes", () => {
      beforeEach(() => {
        node.i.d_val(<any>{
          "foo": null,
          "foo.bar": 1,
          "foo.baz": 2
        }, "1");
      });

      it("should emit on 'ev_load'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.ev_load, spy);
        node.i.d_val(<any>{
          "foo.bar": 1
        }, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe("on input (a_next)", () => {
    let node: FlameThrottler;

    beforeEach(() => {
      node = createFlameThrottler(2);
    });

    describe("when buffer is non-empty", () => {
      beforeEach(() => {
        node.i.d_val({
          "foo": null,
          "foo.bar": 1,
          "foo.baz": 2
        }, "1");
      });

      it("should emit on 'd_val'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.a_next(null, "2");
        expect(spy).toHaveBeenCalledWith({
          "foo": null,
          "foo.bar": 1
        }, "2");
      });
    });

    describe("when buffer is empty", () => {
      it("should not emit on 'd_val'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.a_next(null, "2");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
