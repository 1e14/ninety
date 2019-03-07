import {connect} from "river-core";
import {createView, View} from "./View";

describe("createView()", () => {
  describe("on input (ev_smp)", () => {
    let node: View<{
      content: string
    }>;

    beforeEach(() => {
      node = createView("foo", (vm) => ({
        set: {innerText: vm.set.content}
      }), {
        content: "bar"
      });
    });

    it("should emit contents on 'v_diff'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.v_diff, spy);
      node.i.ev_smp(null, "1");
      expect(spy).toHaveBeenCalledWith({
        del: {
          foo: null
        },
        set: {
          "foo.innerText": "bar"
        }
      }, "1");
    });

    it("should emit on 'ev_smp'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.ev_smp, spy);
      node.i.ev_smp(null, "1");
      expect(spy).toHaveBeenCalledWith(null, "1");
    });
  });

  describe("on input (v_diff)", () => {
    let node: View<{}>;

    beforeEach(() => {
      node = createView("foo", () => null);
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
      node = createView("foo", (vm) => ({
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
