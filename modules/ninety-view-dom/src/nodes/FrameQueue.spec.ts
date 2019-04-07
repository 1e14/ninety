import {connect} from "1e14";
import {createFrameQueue, FrameQueue} from "./FrameQueue";

describe("createFrameQueue()", () => {
  describe("on input (d_view)", () => {
    let node: FrameQueue;

    beforeEach(() => {
      node = createFrameQueue(2);
    });

    it("should emit new queue length on 'd_length", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_length, spy);
      node.i.d_view({
        del: {},
        set: {
          "foo.bar": 1,
          "foo.baz": 2,
          "foo.quux": 3
        }
      }, "1");
      expect(spy).toHaveBeenCalledWith(2, "1");
    });

    describe("when queue was empty", () => {
      it("should emit on 'ev_load'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.ev_load, spy);
        node.i.d_view({
          del: {},
          set: {
            "foo.bar": 1,
            "foo.baz": 2,
            "foo.quux": 3
          }
        }, "1");
        expect(spy).toHaveBeenCalledWith(null, "1");
      });
    });

    describe("when queue was not empty", () => {
      beforeEach(() => {
        node.i.d_view({
          del: {},
          set: {
            "foo.bar": 1,
            "foo.baz": 2
          }
        }, "1");
      });

      it("should not emit on 'ev_load'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.ev_load, spy);
        node.i.d_view({
          del: {},
          set: {
            "foo.quux": 3
          }
        }, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe("on input (ev_next)", () => {
    let node: FrameQueue;

    beforeEach(() => {
      node = createFrameQueue(2);
    });

    describe("when queue is not empty", () => {
      beforeEach(() => {
        node.i.d_view({
          del: {},
          set: {
            "foo.bar": 1,
            "foo.baz": 2,
            "foo.quux": 3
          }
        }, "1");
      });

      it("should emit next frame on 'd_frame'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_frame, spy);
        node.i.ev_next(null, "2");
        expect(spy).toHaveBeenCalledWith({
          del: {},
          set: {
            "foo.bar": 1,
            "foo.baz": 2
          },
          size: 2
        }, "2");
      });

      it("should emit new queue length on 'd_length'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_length, spy);
        node.i.ev_next(null, "2");
        expect(spy).toHaveBeenCalledWith(1, "2");
      });
    });

    describe("when queue is empty", () => {
      it("should not emit on 'd_frame'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_frame, spy);
        node.i.ev_next(null, "1");
        expect(spy).not.toHaveBeenCalled();
      });

      it("should not emit on 'd_length'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_length, spy);
        node.i.ev_next(null, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
