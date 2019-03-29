import {getDomParent} from "./getDomParent";

describe("getDomParent()", () => {
  it("should build tree", () => {
    const tree: any = {};
    const cache = {"": tree};
    getDomParent(cache, "foo.bar.baz.quux");
    expect(tree).toEqual({
      foo: {
        bar: {
          baz: {}
        }
      }
    });
  });

  it("should return parent node", () => {
    const tree: any = {};
    const cache = {"": tree};
    expect(getDomParent(cache, "foo.bar.baz.quux"))
    .toBe(tree.foo.bar.baz);
  });
});
