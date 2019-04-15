import {getCommonRootLength} from "./getCommonRootLength";

describe("getCommonRootLength()", () => {
  describe("when paths have a common root", () => {
    it("should return position of fork", () => {
      expect(getCommonRootLength("foo.bar.baz", "foo.bar.quux"))
      .toBe(2);
      expect(getCommonRootLength("foo.bar.baz", "foo.bar.baa"))
      .toBe(2);
    });
  });

  describe("when paths have no common root", () => {
    it("should return zero", () => {
      expect(getCommonRootLength("foo.bar.baz", "bar"))
      .toBe(0);
      expect(getCommonRootLength("bar", "foo.bar.baz"))
      .toBe(0);
    });
  });

  describe("when next path includes curr", () => {
    it("should return length of curr", () => {
      expect(getCommonRootLength("foo.bar.baz", "foo.bar"))
      .toBe(2);
    });
  });

  describe("when curr path includes next", () => {
    it("should return length of next's parent", () => {
      expect(getCommonRootLength("foo.bar", "foo.bar.baz"))
      .toBe(1);
    });
  });

  describe("when paths are of equal length", () => {
    it("should return position of fork", () => {
      expect(getCommonRootLength("foo.bar", "foo.baz"))
      .toBe(1);
    });
  });

  describe("when paths are equal", () => {
    it("should return path length", () => {
      expect(getCommonRootLength("foo.bar", "foo.bar"))
      .toBe(2);
    });
  });
});
