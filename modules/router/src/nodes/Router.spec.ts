import {connect} from "river-core";
import {createRouter, Router} from "./Router";

describe("createRouter()", () => {
  describe("on input (d_route)", () => {
    let node: Router;

    const ROUTE_USER = /^user\/(\d+)$/;
    const ROUTE_USERS = /^users$/;

    beforeEach(() => {
      node = createRouter([
        ROUTE_USER,
        ROUTE_USERS
      ]);
    });

    describe("when pattern changes", () => {
      it("should emit on 'd_pattern'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_pattern, spy);
        node.i.d_route("users", "1");
        expect(spy).toHaveBeenCalledWith(ROUTE_USERS, "1");
      });

      it("should emit params on pattern port", () => {
        const spy = jasmine.createSpy();
        connect(node.o[`r_${ROUTE_USERS}`], spy);
        node.i.d_route("users", "1");
        expect(spy).toHaveBeenCalledWith([], "1");
      });
    });

    describe("when only parameters change", function () {
      beforeEach(() => {
        node.i.d_route("user/100", "1");
      });

      it("should not emit on 'd_pattern'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_pattern, spy);
        node.i.d_route("user/200", "2");
        expect(spy).not.toHaveBeenCalled();
      });

      it("should emit params on pattern port", () => {
        const spy = jasmine.createSpy();
        connect(node.o[`r_${ROUTE_USER}`], spy);
        node.i.d_route("user/200", "2");
        expect(spy).toHaveBeenCalledWith(["200"], "2");
      });
    });

    describe("on no change", () => {
      beforeEach(() => {
        node.i.d_route("user/100", "1");
      });

      it("should not emit on 'd_pattern'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_pattern, spy);
        node.i.d_route("user/100", "2");
        expect(spy).not.toHaveBeenCalled();
      });

      it("should not emit params on pattern port", () => {
        const spy = jasmine.createSpy();
        connect(node.o[`r_${ROUTE_USER}`], spy);
        node.i.d_route("user/100", "2");
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe("when route does not match any pattern", () => {
      it("should not emit on 'd_pattern'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_pattern, spy);
        node.i.d_route("foo", "1");
        expect(spy).not.toHaveBeenCalled();
      });

      it("should not emit on pattern ports", () => {
        const spyUser = jasmine.createSpy();
        const spyUsers = jasmine.createSpy();
        connect(node.o[`r_${ROUTE_USER}`], spyUser);
        connect(node.o[`r_${ROUTE_USERS}`], spyUsers);
        node.i.d_route("foo", "1");
        expect(spyUser).not.toHaveBeenCalled();
        expect(spyUsers).not.toHaveBeenCalled();
      });
    });
  });
});
