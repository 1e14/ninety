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
  describe("when paths are equal", () => {
    it("should return parent path", () => {
      expect(getRootPath("foo.bar", "foo.bar")).toBe("foo");
    });
  });

  describe("when second path is undefined", () => {
    it("should return parent path", () => {
      expect(getRootPath("foo.bar", undefined)).toBe("foo");
    });
  });

  describe("when paths have a common root", () => {
    it("should return common root path", () => {
      expect(getRootPath("foo.bar", "foo.baz")).toBe("foo");
    });
  });
});
