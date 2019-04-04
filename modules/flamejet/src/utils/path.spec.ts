import {
  countPathComponents,
  getPathComponent,
  replacePathComponent,
  replacePathTail
} from "./path";

describe("countPathComponents()", () => {
  it("should return number of path components", () => {
    expect(countPathComponents("")).toBe(1);
    expect(countPathComponents("foo")).toBe(1);
    expect(countPathComponents("foo.bar")).toBe(2);
    expect(countPathComponents("foo.bar.baz")).toBe(3);
  });
});

describe("getPathComponent()", () => {
  it("should return specified component", () => {
    expect(getPathComponent("foo.bar.baz.quux", 0)).toBe("foo");
    expect(getPathComponent("foo.bar.baz.quux", 1)).toBe("bar");
    expect(getPathComponent("foo.bar.baz.quux", 2)).toBe("baz");
    expect(getPathComponent("foo.bar.baz.quux", 3)).toBe("quux");
  });
});

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
