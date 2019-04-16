import {flameToTree} from "./flameToTree";

describe("flameToTree()", () => {
  it("should convert flame to tree", () => {
    const result = flameToTree({
      "root.foo.bar.baz": 3,
      "root.foo.quux.0": "hello",
      "root.foo.quux.1": "world",
      "root.foo.quux.2": null
    }, "root");
    expect(result).toEqual({
      foo: {
        bar: {
          baz: 3
        },
        quux: {
          0: "hello",
          1: "world",
          2: null
        }
      }
    });
  });
});
