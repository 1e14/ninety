import {connect} from "1e14";
import {createParentThread, ParentThread} from "./ParentThread";

describe("createParentThread()", () => {
  const worker = <any>global;

  beforeEach(() => {
    worker.onmessage = null;
    worker.postMessage = () => null;
  });

  afterEach(() => {
    delete worker.onmessage;
    delete worker.postMessage;
  });

  describe("on created", () => {
    it("should set onmessage", () => {
      createParentThread();
      expect(typeof worker.onmessage).toBe("function");
    });
  });

  describe("on input (d_msg)", () => {
    let node: ParentThread<number, string>;

    beforeEach(() => {
      node = createParentThread();
    });

    it("should message to parent", () => {
      const spy = spyOn(worker, "postMessage");
      node.i.d_msg(5, "1");
      expect(spy).toHaveBeenCalledWith({value: 5, tag: "1"});
    });
  });

  describe("on message", () => {
    let node: ParentThread<number, string>;

    beforeEach(() => {
      node = createParentThread();
    });

    it("should emit on 'd_msg'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_msg, spy);
      worker.onmessage(<MessageEvent>{data: {value: 5, tag: "1"}});
      expect(spy).toHaveBeenCalledWith(5, "1");
    });
  });
});
