import {diffObjects} from "./diff";

describe("diffObjects()", () => {
  type T = { foo: number };

  it("should include changed values in 'set'", function () {
    expect(diffObjects<T>({foo: 5}, {foo: 6}))
    .toEqual({set: {foo: 6}, del: {}});
  });

  it("should include new values in 'set'", function () {
    expect(diffObjects<T>({}, {foo: 6}))
    .toEqual({set: {foo: 6}, del: {}});
  });

  it("should include deleted values in 'del'", function () {
    expect(diffObjects<T>({foo: 5}, {}))
    .toEqual({set: {}, del: {foo: null}});
  });
});
