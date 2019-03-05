import {connect} from "river-core";
import {createView, View} from "./View";

describe("createView()", () => {
  describe("on input (v_diff)", () => {
    let node: View<{}>;

    beforeEach(() => {
      node = createView("foo");
    });

    it("should emit forwarded view on 'v_diff'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.v_diff, spy);
      node.i.v_diff({
        set: {
          hello: "world"
        }
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        set: {
          "foo.hello": "world"
        }
      }, "1");
    });
  });

  describe("on input (vm_diff)", () => {
    let node: View<{ content: string }>;

    beforeEach(() => {
      node = createView("foo", {}, (vm) => ({
        set: {
          innerText: vm.set.content
        }
      }));
    });

    it("should emit mapped diff on 'v_diff'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.v_diff, spy);
      node.i.vm_diff({
        set: {
          content: "Hello World!"
        }
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        set: {
          "foo.innerText": "Hello World!"
        }
      }, "1");
    });
  });
});
