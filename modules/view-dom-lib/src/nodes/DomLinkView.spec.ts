import {connect} from "river-core";
import {createDomLinkView, DomLinkView} from "./DomLinkView";

describe("createDomLinkView()", () => {
  describe("on input (vm_diff)", () => {
    let node: DomLinkView;

    beforeEach(() => {
      node = createDomLinkView("foo", 1);
    });

    describe("on set", () => {
      it("should emit mapped vm on 'v_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.v_diff, spy);
        node.i.vm_diff({
          del: {},
          set: {
            "bar.content": "Hello",
            "bar.url": "http://"
          }
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {},
          set: {"foo.bar.innerText": "Hello"}
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {},
          set: {"foo.bar.href": "http://"}
        }, "1");
      });
    });

    describe("on del", () => {
      beforeEach(() => {
        node.i.vm_diff({
          del: {},
          set: {
            "bar.content": "Hello",
            "bar.url": "http://"
          }
        }, "1");
      });

      it("should emit mapped vm on 'v_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.v_diff, spy);
        node.i.vm_diff({
          del: {
            "bar.content": null,
            "bar.url": null
          },
          set: {}
        }, "2");
        expect(spy).toHaveBeenCalledWith({
          del: {"foo.bar.innerText": null},
          set: {}
        }, "2");
        expect(spy).toHaveBeenCalledWith({
          del: {"foo.bar.href": null},
          set: {}
        }, "2");
      });
    });
  });
});
