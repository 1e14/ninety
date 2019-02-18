import {getCollection, getField} from "./utils";

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
