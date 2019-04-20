import {flameToTree} from "./flameToTree";

describe("flameToTree()", () => {
  it("should convert flame to tree", () => {
    const result = flameToTree({
      "foo.bar.baz": 3,
      "foo.quux.0": "hello",
      "foo.quux.1": "world",
      "foo.quux.2": null
    });
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
