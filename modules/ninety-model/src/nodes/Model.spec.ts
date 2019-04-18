import {connect} from "1e14";
import {createModel, Model} from "./Model";

describe("createModel()", () => {
  describe("on input (d_val)", () => {
    let node: Model;

    beforeEach(() => {
      node = createModel();
    });

    describe("when buffer is empty", () => {
      it("should merge input into buffer", () => {
        const spy = jasmine.createSpy();
        node.i.d_val({
          "5.emails.home": "regphal@friends.com",
          "5.id": "5",
          "5.name": "Regina Phalange"
        }, "1");
        connect(node.o.d_val, spy);
        node.i.ev_smp(null, "2");
        expect(spy).toHaveBeenCalledWith({
          "5.emails.home": "regphal@friends.com",
          "5.id": "5",
          "5.name": "Regina Phalange"
        }, "2");
      });

      it("should emit flame on 'd_val'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val({
          "5.emails.home": "regphal@friends.com",
          "5.id": "5",
          "5.name": "Regina Phalange"
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          "5.emails.home": "regphal@friends.com",
          "5.id": "5",
          "5.name": "Regina Phalange"
        }, "1");
      });
    });

    describe("when buffer has matching content", () => {
      beforeEach(() => {
        node.i.d_val({
          "5.emails.home": "regphal@friends.com",
          "5.id": "5",
          "5.name": "Regina Phalange"
        }, "1");
      });

      it("should merge input into buffer", () => {
        const spy = jasmine.createSpy();
        node.i.d_val({
          "5.emails.home": null,
          "5.emails.work": "phoebe@friends.com",
          "5.id": "5",
          "5.name": "Regina Phalange"
        }, "1");
        connect(node.o.d_val, spy);
        node.i.ev_smp(null, "2");
        expect(spy).toHaveBeenCalledWith({
          "5.emails.work": "phoebe@friends.com",
          "5.id": "5",
          "5.name": "Regina Phalange"
        }, "2");
      });

      it("should emit diff on 'd_val'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_val, spy);
        node.i.d_val({
          "5.emails.home": null,
          "5.emails.work": "phoebe@friends.com",
          "5.id": "5",
          "5.name": "Regina Phalange"
        }, "1");
        expect(spy).toHaveBeenCalledWith({
          "5.emails.home": null,
          "5.emails.work": "phoebe@friends.com"
        }, "1");
      });
    });
  });

  describe("on input (ev_smp)", () => {
    let node: Model;

    beforeEach(() => {
      node = createModel();
      node.i.d_val({
        "5.emails.home": "regphal@friends.com",
        "5.id": "5",
        "5.name": "Regina Phalange"
      }, "1");
    });

    it("should emit buffer contents on 'd_val'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_val, spy);
      node.i.ev_smp(null, "2");
      expect(spy).toHaveBeenCalledWith({
        "5.emails.home": "regphal@friends.com",
        "5.id": "5",
        "5.name": "Regina Phalange"
      }, "2");
    });
  });
});
