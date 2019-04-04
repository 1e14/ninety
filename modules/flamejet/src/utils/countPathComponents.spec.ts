import {countPathComponents} from "./countPathComponents";

describe("countPathComponents()", () => {
  it("should return number of path components", () => {
    expect(countPathComponents("")).toBe(1);
    expect(countPathComponents("foo")).toBe(1);
    expect(countPathComponents("foo.bar")).toBe(2);
    expect(countPathComponents("foo.bar.baz")).toBe(3);
  });
});
