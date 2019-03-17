import {FlameDiff} from "../types";
import {
  applyDiff,
  compoundDiff,
  filterFlame,
  filterFlameByPrefix
} from "./diff";

describe("filterFlame()", () => {
  it("should return filtered flame", () => {
    expect(filterFlame({
      bar: 2,
      baz: 3,
      foo: 1
    }, {
      baz: null,
      foo: null
    })).toEqual({
      baz: 3,
      foo: 1
    });
  });

  describe("on no hits", () => {
    it("should return null", () => {
      expect(filterFlame({
        bar: 2
      }, {
        baz: null,
        foo: null
      })).toBeNull();
    });
  });
});

describe("filterFlameByPrefix()", () => {
  it("should return filtered flame", () => {
    expect(filterFlameByPrefix({
      bar: 2,
      baz: 3,
      foo: 1
    }, {
      ba: null
    })).toEqual({
      bar: 2,
      baz: 3
    });
  });

  describe("on no hits", () => {
    it("should return null", () => {
      expect(filterFlameByPrefix({
        bar: 2,
        baz: 3,
        foo: 1
      }, {
        quux: null
      })).toBeNull();
    });
  });
});

describe("applyDiff()", () => {
  describe("when source is empty", () => {
    let hash: Partial<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      hash = {foo: 5};
    });

    it("should not change target", () => {
      applyDiff(<FlameDiff>{}, hash);
      expect(hash).toEqual({foo: 5});
    });

    it("should return false", () => {
      const result = applyDiff(<FlameDiff>{}, hash);
      expect(result).toBe(false);
    });
  });

  describe("when source doesn't change", () => {
    let hash: Partial<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      hash = {foo: 5};
    });

    it("should not change target", () => {
      applyDiff({set: {foo: 5}, del: {bar: null}}, hash);
      expect(hash).toEqual({foo: 5});
    });

    it("should return false", () => {
      const result = applyDiff({set: {foo: 5}, del: {bar: null}}, hash);
      expect(result).toBe(false);
    });
  });

  describe("on set", () => {
    let hash: Partial<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      hash = {};
    });

    it("should add property to 'set'", () => {
      applyDiff({del: {}, set: {foo: 5}}, hash);
      expect(hash).toEqual({foo: 5});
    });
  });

  describe("on delete", () => {
    let hash: Partial<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      hash = {foo: 5};
    });

    it("should remove property from 'set'", () => {
      applyDiff({del: {foo: null}, set: {}}, hash);
      expect(hash).toEqual({});
    });
  });
});

describe("compoundDiff()", () => {
  describe("when source is empty", () => {
    let diff: FlameDiff;

    beforeEach(() => {
      diff = {set: {foo: 5}, del: {}};
    });

    it("should not change target", () => {
      compoundDiff(<FlameDiff>{}, diff);
      expect(diff).toEqual({set: {foo: 5}, del: {}});
    });

    it("should return false", () => {
      const result = compoundDiff(<FlameDiff>{}, diff);
      expect(result).toBe(false);
    });
  });

  describe("when source doesn't change", () => {
    let diff: FlameDiff;

    beforeEach(() => {
      diff = {set: {foo: 5}, del: {bar: null}};
    });

    it("should not change target", () => {
      compoundDiff({set: {foo: 5}, del: {bar: null}}, diff);
      expect(diff).toEqual({set: {foo: 5}, del: {bar: null}});
    });

    it("should return false", () => {
      const result = compoundDiff({set: {foo: 5}, del: {bar: null}}, diff);
      expect(result).toBe(false);
    });
  });

  describe("on set", () => {
    let diff: FlameDiff;

    beforeEach(() => {
      diff = {set: {}, del: {foo: null}};
    });

    it("should add property to 'set'", () => {
      compoundDiff({del: {}, set: {foo: 5}}, diff);
      expect(diff.set).toEqual({foo: 5});
    });

    it("should remove property from 'del'", () => {
      compoundDiff({del: {}, set: {foo: 5}}, diff);
      expect(diff.del).toEqual({});
    });
  });

  describe("on delete", () => {
    let diff: FlameDiff;

    beforeEach(() => {
      diff = {set: {foo: 5}, del: {}};
    });

    it("should remove property from 'set'", () => {
      compoundDiff({del: {foo: null}, set: {}}, diff);
      expect(diff.set).toEqual({});
    });

    it("should add property to 'del'", () => {
      compoundDiff({del: {foo: null}, set: {}}, diff);
      expect(diff.del).toEqual({foo: null});
    });
  });
});
