import {connect} from "1e14";
import {createDomLinkView, DomLinkView} from "./DomLinkView";

describe("createDomLinkView()", () => {
  describe("on input (d_vm)", () => {
    let node: DomLinkView;

    beforeEach(() => {
      node = createDomLinkView(() => "childNodes.0:A", 0);
    });

    describe("on set", () => {
      it("should emit mapped vm on 'd_view'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_view, spy);
        node.i.d_vm({
          del: {},
          set: {
            "foo.text": "Hello",
            "foo.url": "http://"
          }
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {},
          set: {"childNodes.0:A.innerText": "Hello"}
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {},
          set: {"childNodes.0:A.href": "http://"}
        }, "1");
      });
    });

    describe("on del", () => {
      beforeEach(() => {
        node.i.d_vm({
          del: {},
          set: {
            "foo.text": "Hello",
            "foo.url": "http://"
          }
        }, "1");
      });

      it("should emit mapped vm on 'd_view'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_view, spy);
        node.i.d_vm({
          del: {
            "foo.text": null,
            "foo.url": null
          },
          set: {}
        }, "2");
        expect(spy).toHaveBeenCalledWith({
          del: {"childNodes.0:A.innerText": null},
          set: {}
        }, "2");
        expect(spy).toHaveBeenCalledWith({
          del: {"childNodes.0:A.href": null},
          set: {}
        }, "2");
      });
    });
  });
});
