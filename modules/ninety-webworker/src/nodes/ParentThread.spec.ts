import {connect} from "flowcode";
import {createParentThread, ParentThread} from "./ParentThread";

describe("createParentThread()", () => {
  const self = <any>global;
  let onMessage: (event: MessageEvent) => null;

  beforeEach(() => {
    self.self = {
      addEventListener: (event, cb) => {
        switch (event) {
          case "message":
            onMessage = cb;
            break;
        }
      }
    };
    self.postMessage = () => null;
  });

  afterEach(() => {
    delete self.self;
    delete self.postMessage;
  });

  describe("on input (d_msg)", () => {
    let node: ParentThread<number, string>;

    beforeEach(() => {
      node = createParentThread();
    });

    it("should message to parent", () => {
      const spy = spyOn(self, "postMessage");
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
      onMessage(<MessageEvent>{data: {value: 5, tag: "1"}});
      expect(spy).toHaveBeenCalledWith(5, "1");
    });
  });
});
