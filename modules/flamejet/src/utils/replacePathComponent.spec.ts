import {replacePathComponent} from "./replacePathComponent";

describe("replacePathComponent()", () => {
  it("should replace specified component", () => {
    expect(replacePathComponent(
      "foo.bar.baz.quux", 0, (comp) => comp.toUpperCase()))
    .toBe("FOO.bar.baz.quux");
    expect(replacePathComponent(
      "foo.bar.baz.quux", 1, (comp) => comp.toUpperCase()))
    .toBe("foo.BAR.baz.quux");
    expect(replacePathComponent(
      "foo.bar.baz.quux", 2, (comp) => comp.toUpperCase()))
    .toBe("foo.bar.BAZ.quux");
    expect(replacePathComponent(
      "foo.bar.baz.quux", 3, (comp) => comp.toUpperCase()))
    .toBe("foo.bar.baz.QUUX");
  });
});
