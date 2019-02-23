import {mergeObject} from "./merge";

describe("mergeObject()", () => {
  type T = { foo: number; bar: boolean; baz: string; };

  it("should set key-value pairs in 'set'", function () {
    const contents = <Partial<T>>{
      baz: "1",
      foo: 5
    };

    mergeObject<T>(contents, {
      del: {},
      set: {bar: true, foo: 6}
    });

    expect(contents).toEqual({
      bar: true,
      baz: "1",
      foo: 6
    });
  });

  it("should unset key-value pairs in 'del'", function () {
    const contents = <Partial<T>>{
      baz: "1",
      foo: 5
    };

    mergeObject<T>(contents, {
      del: {foo: null},
      set: {}
    });

    expect(contents).toEqual({
      baz: "1",
      foo: undefined
    });
  });

  it("should return true", function () {
    const contents = <Partial<T>>{
      baz: "1",
      foo: 5
    };

    const result = mergeObject<T>(contents, {
      del: {foo: null},
      set: {}
    });

    expect(result).toBe(true);
  });

  describe("for empty diff", function () {
    it("should return false", () => {
      const contents = <Partial<T>>{
        baz: "1",
        foo: 5
      };

      const result = mergeObject<T>(contents, {
        del: {},
        set: {}
      });

      expect(result).toBe(false);
    });
  });

  describe("for inconsequential merge", function () {
    it("should return false", () => {
      const contents = <Partial<T>>{
        baz: "1",
        foo: 5
      };

      const result = mergeObject<T>(contents, {
        del: <any>{
          quux: null
        },
        set: {
          foo: 5
        }
      });

      expect(result).toBe(false);
    });
  });
});
