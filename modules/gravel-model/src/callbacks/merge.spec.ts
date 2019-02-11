import {mergeObject} from "./merge";

describe("mergeObject()", () => {
  type T = { foo: number; bar: boolean; baz: string; };

  it("should set key-value pairs in 'set'", function () {
    const contents = <Partial<T>>{
      baz: "1",
      foo: 5
    };

    mergeObject<T>(contents, {
      set: [["bar", true], ["foo", 6]]
    });

    expect(contents).toEqual({
      bar: true,
      baz: "1",
      foo: 6
    });
  });

  it("should delete keys in 'del'", function () {
    const contents = <Partial<T>>{
      baz: "1",
      foo: 5
    };

    mergeObject<T>(contents, {
      del: ["foo"]
    });

    expect(contents).toEqual({
      baz: "1"
    });
  });
});
