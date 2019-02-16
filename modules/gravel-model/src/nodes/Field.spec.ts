import {connect} from "@protoboard/river";
import {createField, TField} from "./Field";

describe("createField()", () => {
  describe("on input (d_val)", () => {
    let node: TField<number>;

    beforeEach(() => {
      node = createField();
    });

    describe("for different value", () => {
      it("should emit on 'd_val'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val(3, "1");
        expect(spy).toHaveBeenCalledWith(3, "1");
      });

      describe("when invalidated", () => {
        beforeEach(() => {
          node.i.ev_inv(null);
        });

        it("should emit on 'st_inv'", () => {
          const spy = jasmine.createSpy();
          connect(node.o.st_inv, spy);
          node.i.d_val(3, "1");
          expect(spy).toHaveBeenCalledWith(false, "1");
        });
      });

      describe("when not invalidated", () => {
        beforeEach(() => {
          node.i.d_val(5);
        });

        it("should not emit on 'st_inv'", () => {
          const spy = jasmine.createSpy();
          connect(node.o.st_inv, spy);
          node.i.d_val(3, "1");
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });

    describe("for equal value", () => {
      beforeEach(() => {
        node.i.d_val(5);
      });

      it("should not emit on 'd_val'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val(5, "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });

  describe("on input (ev_inv)", () => {
    let node: TField<number>;

    beforeEach(() => {
      node = createField();
    });

    describe("when not invalidated", function () {
      it("should emit on 'st_inv'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.st_inv, spy);
        node.i.ev_inv(null, "1");
        expect(spy).toHaveBeenCalledWith(true, "1");
      });
    });
  });

  describe("on input (ev_smp)", () => {
    let node: TField<number>;

    beforeEach(() => {
      node = createField();
      node.i.d_val(5);
    });

    it("should emit on 'd_val'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_val, spy);
      node.i.ev_smp(null, "1");
      expect(spy).toHaveBeenCalledWith(5, "1");
    });
  });
});
