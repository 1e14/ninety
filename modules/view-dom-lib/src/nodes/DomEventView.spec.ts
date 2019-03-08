import {connect} from "river-core";
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
  describe("on input (ev_smp)", () => {
    let node: DomEventView<Event>;

    beforeEach(() => {
      node = createDomEventView("foo", "onclick");
    });

    it("should emit on 'v_diff'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.v_diff, spy);
      node.i.ev_smp(null, "1");
      expect(spy).toHaveBeenCalled();
      const args = spy.calls.argsFor(0);
      expect(typeof args[0].set["foo.onclick"]).toBe("function");
      expect(args[1]).toBe("1");
    });
  });

  describe("on click event", () => {
    let node: DomEventView<Event>;
    let onclick: (event: Event) => void;

    beforeEach(() => {
      node = createDomEventView("foo", "onclick");
      connect(node.o.v_diff, (diff) => {
        onclick = diff.set["foo.onclick"];
      });
      node.i.ev_smp(null, "1");
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
      expect(spy).toHaveBeenCalledWith(event, "1");
    });
  });
});
