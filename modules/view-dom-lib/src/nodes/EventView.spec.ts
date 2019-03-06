import {connect} from "river-core";
import {createEventView, EventView} from "./EventView";

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
  describe("on input (vm_diff)", () => {
    let node: EventView<Event>;

    beforeEach(() => {
      node = createEventView("foo", "onclick");
    });

    it("should emit on 'v_diff'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.v_diff, spy);
      node.i.vm_diff(null, "1");
      expect(spy).toHaveBeenCalled();
      const args = spy.calls.argsFor(0);
      expect(typeof args[0].set["foo.onclick"]).toBe("function");
      expect(args[1]).toBe("1");
    });
  });

  describe("on click event", () => {
    let node: EventView<Event>;
    let onclick: (event: Event) => void;

    beforeEach(() => {
      node = createEventView("foo", "onclick");
      connect(node.o.v_diff, (diff) => {
        onclick = diff.set["foo.onclick"];
      });
      node.i.vm_diff(null, "1");
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
