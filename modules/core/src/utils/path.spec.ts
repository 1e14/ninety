import {getRootPath, prefixDiffPaths} from "./path";

describe("prependPaths()", () => {
  it("should prepend paths in diff", () => {
    const result = prefixDiffPaths({
      del: {
        baz: null,
        foo: null
      },
      set: {
        baz: 1,
        foo: "bar"
      }
    }, "_");
    expect(result).toEqual({
      del: {
        "_.baz": null,
        "_.foo": null
      },
      set: {
        "_.baz": 1,
        "_.foo": "bar"
      }
    });
  });
});

describe("getRootPath()", () => {
  describe("for empty path set", () => {
    it("should return undefined", () => {
      expect(getRootPath({})).toBeUndefined();
    });
  });

  describe("for single path", () => {
    it("should return parent path", () => {
      expect(getRootPath({
        "foo.bar": null
      })).toBe("foo");
    });
  });

  describe("for multiple paths", () => {
    it("should return root path", () => {
      expect(getRootPath({
        "foo.bar.baz": null,
        "foo.bar.quux": null,
        "foo.baz": null
      })).toBe("foo");
      expect(getRootPath({
        "bar.baz": null,
        "bar.quux": null,
        "baz": null
      })).toBe("");
    });
  });
});
