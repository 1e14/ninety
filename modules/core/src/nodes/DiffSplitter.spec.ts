import {connect} from "river-core";
import {createDiffSplitter, DiffSplitter} from "./DiffSplitter";

describe("createDiffSplitter()", () => {
  type Ports = "d_name" | "d_photo";
  type Paths = "foo" | "bar" | "baz";

  describe("on input (d_diff)", () => {
    let node: DiffSplitter<Ports, Paths>;

    beforeEach(() => {
      node = createDiffSplitter<Ports, Paths>({
        d_name: ["foo", "baz"],
        d_photo: ["bar", "baz"]
      }, 2);
    });

    it("should emit split diffs on corresponding ports", () => {
      const spy1 = jasmine.createSpy();
      const spy2 = jasmine.createSpy();
      connect(node.o.d_name, spy1);
      connect(node.o.d_photo, spy2);
      node.i.d_diff({
        del: {
          "a.b.bar.c": null
        },
        set: {
          "a.b.baz.c": "quux",
          "a.b.foo.d": 5
        }
      }, "1");
      expect(spy1).toHaveBeenCalledWith({
        del: {},
        set: {
          "a.b.baz.c": "quux",
          "a.b.foo.d": 5
        }
      }, "1");
      expect(spy2).toHaveBeenCalledWith({
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
