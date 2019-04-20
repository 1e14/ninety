import {treeToFlame} from "./treeToFlame";

describe("treeToFlame()", () => {
  it("should convert tree to flame", () => {
    const result = treeToFlame({
      foo: {
        bar: {
          baz: 3
        },
        quux: ["hello", "world", null]
      }
    });
    expect(result).toEqual({
      "foo.bar.baz": 3,
      "foo.quux.0": "hello",
      "foo.quux.1": "world",
      "foo.quux.2": null
    });
  });
});
