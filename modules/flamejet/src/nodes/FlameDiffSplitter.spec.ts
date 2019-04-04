import {connect} from "1e14";
import {createFlameDiffSplitter, FlameDiffSplitter} from "./FlameDiffSplitter";

describe("createFlameDiffSplitter()", () => {
  type Ports = "d_name" | "d_photo" | "d_dob";

  describe("on input (d_diff)", () => {
    let node: FlameDiffSplitter<Ports>;

    beforeEach(() => {
      node = createFlameDiffSplitter<Ports>({
        d_dob: ["quux"],
        d_name: ["foo", "baz"],
        d_photo: ["bar", "baz"]
      }, 2);
    });

    it("should emit split flames on corresponding ports", () => {
      const spy1 = jasmine.createSpy();
      const spy2 = jasmine.createSpy();
      const spy3 = jasmine.createSpy();
      connect(node.o.d_dob, spy1);
      connect(node.o.d_name, spy2);
      connect(node.o.d_photo, spy3);
      node.i.d_diff({
        del: {
          "a.b.bar.c": null
        },
        set: {
          "a.b.baz.c": "quux",
          "a.b.foo.d": 5
        }
      }, "1");
      expect(spy1).not.toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith({
        del: {},
        set: {
          "a.b.baz.c": "quux",
          "a.b.foo.d": 5
        }
      }, "1");
      expect(spy3).toHaveBeenCalledWith({
        del: {
          "a.b.bar.c": null
        },
        set: {
          "a.b.baz.c": "quux"
        }
      }, "1");
    });
  });
});
