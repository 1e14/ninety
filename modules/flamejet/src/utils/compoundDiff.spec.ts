import {FlameDiff} from "../types";
import {compoundDiff} from "./compoundDiff";

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
