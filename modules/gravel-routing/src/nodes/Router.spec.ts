import {connect} from "@protoboard/river";
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
      it("should emit on corresponding port", () => {
        const spy = jasmine.createSpy();
        connect(node.o["/^user\\/(\\d+)$/"], spy);
        node.i.d_path("user/100", "1");
        expect(spy).toHaveBeenCalledWith(["100"], "1");
      });
    });

    describe("when path does not match route", () => {
      it("should not emit on corresponding port", () => {
        const spy = jasmine.createSpy();
        connect(node.o["/^user\\/(\\d+)$/"], spy);
        node.i.d_path("foo/100", "1");
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});
