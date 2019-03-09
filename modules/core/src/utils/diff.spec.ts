import {Any} from "river-core";
import {Diff} from "../types";
import {compoundDiff} from "./diff";

describe("compoundDiff()", () => {
  describe("when source is empty", () => {
    let diff: Diff<{ foo: number, bar: boolean }>;

    beforeEach(() => {
      diff = {set: {foo: 5}, del: {}};
    });

    it("should not change target", () => {
      compoundDiff(<Diff<Any>>{}, diff);
      expect(diff).toEqual({set: {foo: 5}, del: {}});
    });

    it("should return false", () => {
      const result = compoundDiff(<Diff<Any>>{}, diff);
      expect(result).toBe(false);
    });
  });

  describe("when source doesn't change", () => {
    let diff: Diff<{ foo: number, bar: boolean }>;

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
    let diff: Diff<{ foo: number, bar: boolean }>;

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
    let diff: Diff<{ foo: number, bar: boolean }>;

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
