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
    }, "root");
    expect(result).toEqual({
      "root.foo.bar.baz": 3,
      "root.foo.quux.0": "hello",
      "root.foo.quux.1": "world",
      "root.foo.quux.2": null
    });
  });
});
