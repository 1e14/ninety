import {replacePathTail} from "./replacePathTail";

describe("replacePathTail()", () => {
  it("should replace specified component", () => {
    expect(replacePathTail(
      "foo", (comp) => comp.toUpperCase()))
    .toBe("FOO");
    expect(replacePathTail(
      "foo.bar", (comp) => comp.toUpperCase()))
    .toBe("foo.BAR");
    expect(replacePathTail(
      "foo.bar.baz", (comp) => comp.toUpperCase()))
    .toBe("foo.bar.BAZ");
    expect(replacePathTail(
      "foo.bar.baz.quux", (comp) => comp.toUpperCase()))
    .toBe("foo.bar.baz.QUUX");
  });
});
