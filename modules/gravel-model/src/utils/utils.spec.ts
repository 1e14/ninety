import {getField} from "./utils";

describe("getField()", () => {
  it("should return field node", () => {
    expect(getField("foo")).toBeDefined();
  });
});
