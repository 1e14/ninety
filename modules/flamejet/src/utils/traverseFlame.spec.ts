import {traverseFlame} from "./traverseFlame";

describe("traverseFlame()", () => {
  const flame = {
    "bar": 0,
    "foo.bar": 1,
    "foo.baz": 2,
    "quux": 3
  };

  it("should invoke callback", () => {
    const spy = jasmine.createSpy();
    traverseFlame(flame, spy, "bar");
    expect(spy.calls.allArgs()).toEqual([
      ["bar", 0, 1],
      ["foo.bar", 1, 0],
      ["foo.baz", 2, 1],
      ["quux", 3, 0]
    ]);
  });
});
