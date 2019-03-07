import {Diff} from "gravel-core";
import {Any, connect} from "river-core";
import {Collection, createCollection} from "./Collection";

describe("createCollection()", () => {
  describe("on input (d_diff)", () => {
    let node: Collection<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      node = createCollection();
      node.i.d_val({
        bar: true
      });
    });

    describe("for non-empty diff", () => {
      it("should emit on 'd_val'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_diff({
          del: {bar: null},
          set: {foo: 5}
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          foo: 5
        }, "1");
      });

      it("should emit on 'd_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_diff, spy);
        node.i.d_diff({
          del: {bar: null},
          set: {foo: 5}
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {bar: null},
          set: {foo: 5}
        }, "1");
      });

      describe("when invalidated", () => {
        beforeEach(() => {
          node.i.ev_inv(null);
        });

        it("should emit on 'st_inv'", () => {
          const spy = jasmine.createSpy();
          connect(node.o.st_inv, spy);
          node.i.d_diff({
            del: {bar: null},
            set: {foo: 5}
          }, "1");
          expect(spy).toHaveBeenCalledWith(false, "1");
        });
      });

      describe("when not invalidated", () => {
        beforeEach(() => {
          node.i.d_val({});
        });

        it("should not emit on 'st_inv'", () => {
          const spy = jasmine.createSpy();
          connect(node.o.st_inv, spy);
          node.i.d_diff({
            del: {bar: null},
            set: {foo: 5}
          }, "1");
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });

    describe("for empty diff", () => {
      it("should not emit on 'd_val'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_diff(<Diff<Any>>{}, "1");
        expect(spy).not.toHaveBeenCalled();
      });

      it("should not forward d_diff", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_diff, spy);
        node.i.d_diff(<Diff<Any>>{}, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe("on input (d_val)", () => {
    let node: Collection<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      node = createCollection();
      node.i.d_val({
        bar: true
      });
    });

    describe("for different contents", () => {
      it("should emit on 'd_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_diff, spy);
        node.i.d_val({
          foo: 5
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {bar: null},
          set: {foo: 5}
        }, "1");
      });

      it("should emit on 'd_val'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val({
          foo: 5
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          foo: 5
        }, "1");
      });

      describe("when invalidated", () => {
        beforeEach(() => {
          node.i.ev_inv(null);
        });

        it("should emit on 'st_inv'", () => {
          const spy = jasmine.createSpy();
          connect(node.o.st_inv, spy);
          node.i.d_val({
            foo: 5
          }, "1");
          expect(spy).toHaveBeenCalledWith(false, "1");
        });
      });

      describe("when not invalidated", () => {
        beforeEach(() => {
          node.i.d_val({});
        });

        it("should not emit on 'st_inv'", () => {
          const spy = jasmine.createSpy();
          connect(node.o.st_inv, spy);
          node.i.d_val({
            foo: 5
          }, "1");
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });

    describe("for equal contents", () => {
      it("should not emit on 'd_val'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val({
          bar: true
        }, "1");
        expect(spy).not.toHaveBeenCalled();
      });

      it("should not emit on 'd_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_diff, spy);
        node.i.d_val({
          bar: true
        }, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe("on input (ev_inv)", () => {
    let node: Collection<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      node = createCollection();
      node.i.d_val({
        bar: true
      });
    });

    describe("when not invalidated", function () {
      it("should emit on 'st_inv'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.st_inv, spy);
        node.i.ev_inv(null, "1");
        expect(spy).toHaveBeenCalledWith(true, "1");
      });
    });

    describe("when invalidated", () => {
      beforeEach(() => {
        node.i.ev_inv(null);
      });

      it("should not emit on 'st_inv'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.st_inv, spy);
        node.i.ev_inv(null, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe("on input (ev_smp)", () => {
    let node: Collection<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      node = createCollection();
      node.i.d_val({
        bar: true
      });
    });

    it("should emit on 'd_val'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_val, spy);
      node.i.ev_smp(null, "1");
      expect(spy).toHaveBeenCalledWith({
        bar: true
      }, "1");
    });
  });
});
