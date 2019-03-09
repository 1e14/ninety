import {Any} from "river-core";
import {Diff} from "../types";
import {compoundDiff, getCommonStem, prefixDiffPaths} from "./utils";

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

describe("compoundDiff()", () => {
  describe("when source is empty", () => {
    let diff: Diff<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      diff = {set: {foo: 5}, del: {}};
    });

    it("should not change target", () => {
      compoundDiff(<Diff<Any>>{}, diff);
      expect(diff).toEqual({set: {foo: 5}, del: {}});
    });

    it("should return false", () => {
      const result = compoundDiff(<Diff<Any>>{}, diff);
      expect(result).toBe(false);
    });
  });

  describe("when source doesn't change", () => {
    let diff: Diff<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      diff = {set: {foo: 5}, del: {bar: null}};
    });

    it("should not change target", () => {
      compoundDiff({set: {foo: 5}, del: {bar: null}}, diff);
      expect(diff).toEqual({set: {foo: 5}, del: {bar: null}});
    });

    it("should return false", () => {
      const result = compoundDiff({set: {foo: 5}, del: {bar: null}}, diff);
      expect(result).toBe(false);
    });
  });

  describe("on set", () => {
    let diff: Diff<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      diff = {set: {}, del: {foo: null}};
    });

    it("should add property to 'set'", () => {
      compoundDiff({del: {}, set: {foo: 5}}, diff);
      expect(diff.set).toEqual({foo: 5});
    });

    it("should remove property from 'del'", () => {
      compoundDiff({del: {}, set: {foo: 5}}, diff);
      expect(diff.del).toEqual({});
    });
  });

  describe("on delete", () => {
    let diff: Diff<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      diff = {set: {foo: 5}, del: {}};
    });

    it("should remove property from 'set'", () => {
      compoundDiff({del: {foo: null}, set: {}}, diff);
      expect(diff.set).toEqual({});
    });

    it("should add property to 'del'", () => {
      compoundDiff({del: {foo: null}, set: {}}, diff);
      expect(diff.del).toEqual({foo: null});
    });
  });
});

describe("getCommonStem()", () => {
  describe("when args are equal", () => {
    it("should return first argument", () => {
      expect(getCommonStem("foo", "foo")).toBe("foo");
    });
  });

  describe("when second arg is undefined", () => {
    it("should return first argument", () => {
      expect(getCommonStem("foo", undefined)).toBe("foo");
    });
  });

  describe("when args have a common stem", () => {
    it("should return common stem", () => {
      expect(getCommonStem("foo.bar", "foo.baz")).toBe("foo.ba");
      expect(getCommonStem("foo.bar", "foo.quux")).toBe("foo.");
    });
  });
});
