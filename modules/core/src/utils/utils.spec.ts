import {prefixDiffPaths} from "./utils";

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
        _baz: null,
        _foo: null
      },
      set: {
        _baz: 1,
        _foo: "bar"
      }
    });
  });
});
