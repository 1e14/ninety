import {connect} from "1e14";
import {createWorkerThread, WorkerThread} from "./WorkerThread";

describe("createWorkerThread()", () => {
  const window = <any>global;

  beforeEach(() => {
    window.Worker = function () {//
    };
    window.Worker.prototype = {
      postMessage() {//
      }
    };
  });

  afterEach(() => {
    delete window.Worker;
  });

  describe("on creation", () => {
    it("should create WorkerThread instance", () => {
      const spy = spyOn(window, "Worker");
      createWorkerThread("foo.js");
      expect(spy).toHaveBeenCalledWith("foo.js");
    });
  });

  describe("on input (d_msg)", () => {
    let node: WorkerThread<number, string>;

    beforeEach(() => {
      node = createWorkerThread("foo.js");
    });

    it("should send message to worker", () => {
      const spy = spyOn(window.Worker.prototype, "postMessage");
      node.i.d_msg(5, "1");
      expect(spy).toHaveBeenCalledWith({value: 5, tag: "1"});
    });
  });

  describe("on message", () => {
    let node: WorkerThread<number, string>;
    let worker: Worker;

    beforeEach(() => {
      worker = new window.Worker("foo.js");
      spyOn(window, "Worker").and.returnValue(worker);
      node = createWorkerThread("foo.js");
    });

    it("should emit on 'd_msg'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_msg, spy);
      worker.onmessage(<MessageEvent>{data: {value: 5, tag: "1"}});
      expect(spy).toHaveBeenCalledWith(5, "1");
    });
  });

  describe("on error", () => {
    let node: WorkerThread<number, string>;
    let worker;

    beforeEach(() => {
      worker = new window.Worker("foo.js");
      spyOn(window, "Worker").and.returnValue(worker);
      node = createWorkerThread("foo.js");
    });

    it("should emit on 'ev_err'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.ev_err, spy);
      worker.onerror();
      expect(spy).toHaveBeenCalled();
    });
  });
});
