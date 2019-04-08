import {connect} from "1e14";
import {createFrameBuffer, FrameBuffer} from "./FrameBuffer";

describe("createFrameBuffer()", () => {
  describe("on input (d_view)", () => {
    let node: FrameBuffer;

    beforeEach(() => {
      node = createFrameBuffer(2);
    });

    it("should emit buffer size on 'd_size'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_size, spy);
      node.i.d_view({
        del: {
          foo: null
        },
        set: {
          "foo.bar": 1,
          "foo.baz": 2
        }
      }, "1");
      expect(spy).toHaveBeenCalledWith(3, "1");
    });

    describe("when buffer is no longer empty", () => {
      it("should emit on 'ev_load'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.ev_load, spy);
        node.i.d_view({
          del: {
            foo: null
          },
          set: {
            "foo.bar": 1,
            "foo.baz": 2
          }
        }, "1");
        expect(spy).toHaveBeenCalledWith(null, "1");
      });
    });

    describe("when nonzero buffer size changes", () => {
      beforeEach(() => {
        node.i.d_view(<any>{
          del: {
            foo: null
          },
          set: {
            "foo.bar": 1,
            "foo.baz": 2
          }
        }, "1");
      });

      it("should emit on 'ev_load'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.ev_load, spy);
        node.i.d_view(<any>{
          del: {
            "foo.bar": 1
          },
          set: {}
        }, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe("on input (ev_next)", () => {
    let node: FrameBuffer;

    beforeEach(() => {
      node = createFrameBuffer(2);
    });

    describe("when buffer is non-empty", () => {
      beforeEach(() => {
        node.i.d_view({
          del: {
            foo: null
          },
          set: {
            "foo.bar": 1,
            "foo.baz": 2
          }
        }, "1");
      });

      it("should emit frame on 'd_frame'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_frame, spy);
        node.i.ev_next(null, "2");
        expect(spy).toHaveBeenCalledWith({
          del: {
            foo: null
          },
          set: {
            "foo.bar": 1
          }
        }, "2");
      });
    });

    describe("when buffer is empty", () => {
      it("should not emit on 'd_frame'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_frame, spy);
        node.i.ev_next(null, "2");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
