import {getForkPos} from "./getForkPos";

describe("getForkPos()", () => {
  it("should return position of fork", () => {
    expect(getForkPos("foo.bar.baz", "foo.bar.quux"))
    .toBe(8);
  });
});
