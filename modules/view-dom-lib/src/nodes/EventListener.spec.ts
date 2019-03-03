import {connect} from "river-core";
import {createEventListener, EventListener} from "./EventListener";

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

describe("createEventListener()", () => {
  describe("on input (d_event)", () => {
    let node: EventListener<Event>;

    beforeEach(() => {
      node = createEventListener("foo", "onclick");
    });

    it("should stop event propagation", () => {
      const event = new window.Event("foo");
      spyOn(event, "stopImmediatePropagation");
      node.i.d_event(event, "1");
      expect(event.stopImmediatePropagation).toHaveBeenCalled();
    });

    it("should emit on 'd_event'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_event, spy);
      const event = new window.Event("foo");
      node.i.d_event(event, "1");
      expect(spy).toHaveBeenCalledWith(event, "1");
    });
  });

  describe("on input (ev_smp)", () => {
    let node: EventListener<Event>;

    beforeEach(() => {
      node = createEventListener("foo", "onclick");
    });

    it("should emit on 'd_diff'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_diff, spy);
      node.i.ev_smp(null, "1");
      expect(spy).toHaveBeenCalledWith({
        set: {
          "foo.onclick": node.i.d_event
        }
      }, "1");
    });
  });
});
