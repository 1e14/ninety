import {countCommonComponents} from "./countCommonComponents";

describe("countCommonComponents()", () => {
  it("should return position of fork", () => {
    expect(countCommonComponents("foo.bar.baz", "foo.bar.quux"))
    .toBe(2);
    expect(countCommonComponents("foo.bar.baz", "foo.bar.baa"))
    .toBe(2);
    expect(countCommonComponents("foo.bar", "foo.bar"))
    .toBe(2);
    expect(countCommonComponents("foo", "foo.bar.baa"))
    .toBe(1);
    expect(countCommonComponents("foo.bar.baz", "foo"))
    .toBe(1);
  });
});
