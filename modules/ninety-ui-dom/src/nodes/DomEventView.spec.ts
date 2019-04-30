import {connect} from "1e14";
import {createDomEventView, DomEventView} from "./DomEventView";

const window = <any>global;

beforeEach(() => {
  window.Event = function () {//
  };
  window.Event.prototype = {
    stopImmediatePropagation: () => null
  };
});

afterEach(() => {
  delete window.Event;
});

describe("createEventView()", () => {
  describe("on input (d_in)", () => {
    let node: DomEventView;

    beforeEach(() => {
      node = createDomEventView("onclick");
    });

    it("should emit on 'd_out'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_out, spy);
      node.i.d_in({
        "foo.bar.baz": null
      }, "1");
      expect(spy).toHaveBeenCalled();
      const args = spy.calls.argsFor(0);
      expect(typeof args[0]["foo.bar.onclick"]).toBe("function");
      expect(args[1]).toBe("1");
    });
  });

  describe("on click event", () => {
    let node: DomEventView;
    let onclick: (event: Event) => void;

    beforeEach(() => {
      node = createDomEventView("onclick");
      connect(node.o.d_out, (view) => {
        onclick = view["foo.bar.onclick"];
      });
      node.i.d_in({
        "foo.bar.baz": null
      }, "1");
    });

    it("should stop event propagation", () => {
      const event = new window.Event("foo");
      spyOn(event, "stopImmediatePropagation");
      onclick(event);
      expect(event.stopImmediatePropagation).toHaveBeenCalled();
    });

    it("should emit on 'd_event'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_event, spy);
      const event = new window.Event("foo");
      onclick(event);
      expect(spy).toHaveBeenCalledWith({
        "foo.bar.baz": event
      }, "1");
    });
  });
});
