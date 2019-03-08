import {connect} from "river-core";
import {createRouter, Router} from "./Router";

describe("createRouter()", () => {
  describe("on input (d_route)", () => {
    let node: Router;

    beforeEach(() => {
      node = createRouter([
        /^$/,
        /^user\/(\d+)$/
      ]);
    });

    describe("when path matches route", () => {
      it("should emit params on corresponding port", () => {
        const spy = jasmine.createSpy();
        connect(node.o["r_/^user\\/(\\d+)$/"], spy);
        node.i.d_route("user/100", "1");
        expect(spy).toHaveBeenCalledWith(["100"], "1");
      });

      it("should emit route on 'd_template'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_template, spy);
        node.i.d_route("user/100", "1");
        expect(spy).toHaveBeenCalledWith(/^user\/(\d+)$/, "1");
      });

      describe("but route did not change", function () {
        beforeEach(() => {
          node.i.d_route("user/100", "1");
        });

        it("should not emit on 'd_template'", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_template, spy);
          node.i.d_route("user/200", "2");
          expect(spy).not.toHaveBeenCalled();
        });
      });

      describe("but path did not change", function () {
        beforeEach(() => {
          node.i.d_route("user/100", "1");
        });

        it("should not emit on route ports", () => {
          const spy = jasmine.createSpy();
          connect(node.o["r_/^user\\/(\\d+)$/"], spy);
          node.i.d_route("user/100", "2");
          expect(spy).not.toHaveBeenCalled();
        });

        it("should not emit on 'd_template'", () => {
          const spy = jasmine.createSpy();
          connect(node.o.d_template, spy);
          node.i.d_route("user/100", "2");
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });

    describe("when path does not match route", () => {
      it("should not emit on corresponding port", () => {
        const spy = jasmine.createSpy();
        connect(node.o["r_/^user\\/(\\d+)$/"], spy);
        node.i.d_route("foo/100", "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
