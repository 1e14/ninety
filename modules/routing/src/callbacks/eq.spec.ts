import {eqArray} from "./eq";

describe("eqArray()", () => {
  describe("for equal references", () => {
    it("should return true", () => {
      expect(eqArray(null, null)).toBe(true);
      expect(eqArray(undefined, undefined)).toBe(true);
      const array = [];
      expect(eqArray(array, array)).toBe(true);
    });
  });

  describe("for one falsy argument", () => {
    it("should return false", () => {
      expect(eqArray([], null)).toBe(false);
      expect(eqArray(null, [])).toBe(false);
    });
  });

  describe("for different array lengths", () => {
    it("should return false", () => {
      expect(eqArray([1], [1, 2])).toBe(false);
    });
  });

  describe("for different content", () => {
    it("should return false", () => {
      expect(eqArray([1, 2], [1, 3])).toBe(false);
    });
  });

  describe("for identical content", () => {
    it("should return true", () => {
      expect(eqArray([1, 2], [1, 2])).toBe(true);
    });
  });
});
