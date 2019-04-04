import {getPathComponent} from "./getPathComponent";

describe("getPathComponent()", () => {
  it("should return specified component", () => {
    expect(getPathComponent("foo.bar.baz.quux", 0)).toBe("foo");
    expect(getPathComponent("foo.bar.baz.quux", 1)).toBe("bar");
    expect(getPathComponent("foo.bar.baz.quux", 2)).toBe("baz");
    expect(getPathComponent("foo.bar.baz.quux", 3)).toBe("quux");
  });
});
