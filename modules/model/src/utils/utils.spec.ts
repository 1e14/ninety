import {getCollection, getField, isEmptyObject} from "./utils";

describe("getField()", () => {
  it("should return field node", () => {
    expect(getField("foo")).toBeDefined();
  });
});

describe("getCollection()", () => {
  it("should return collection node", () => {
    expect(getCollection("foo")).toBeDefined();
  });
});

describe("isEmptyObject()", () => {
  describe("for empty object", function () {
    it("should return true", () => {
      expect(isEmptyObject({})).toBe(true);
    });
  });

  describe("for non-empty object", function () {
    it("should return false", () => {
      expect(isEmptyObject({
        foo: "bar"
      })).toBe(false);
    });
  });
});
