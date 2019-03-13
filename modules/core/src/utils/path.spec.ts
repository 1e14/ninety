import {
  getPathComponent,
  getRootPath,
  prefixDiffPaths,
  replacePathComponent,
  replacePathTail
} from "./path";

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

describe("getPathComponent()", () => {
  it("should return specified component", () => {
    expect(getPathComponent("foo.bar.baz.quux", 0)).toBe("foo");
    expect(getPathComponent("foo.bar.baz.quux", 1)).toBe("bar");
    expect(getPathComponent("foo.bar.baz.quux", 2)).toBe("baz");
    expect(getPathComponent("foo.bar.baz.quux", 3)).toBe("quux");
  });
});

describe("replacePathComponent()", () => {
  it("should replace specified component", () => {
    expect(replacePathComponent("foo.bar.baz.quux", 0, "a"))
    .toBe("a.bar.baz.quux");
    expect(replacePathComponent("foo.bar.baz.quux", 1, "a"))
    .toBe("foo.a.baz.quux");
    expect(replacePathComponent("foo.bar.baz.quux", 2, "a"))
    .toBe("foo.bar.a.quux");
    expect(replacePathComponent("foo.bar.baz.quux", 3, "a"))
    .toBe("foo.bar.baz.a");
  });
});

describe("replacePathTail()", () => {
  it("should replace end of path", () => {
    expect(replacePathTail("foo.bar.baz.quux", "a"))
    .toBe("foo.bar.baz.a");
  });
});
