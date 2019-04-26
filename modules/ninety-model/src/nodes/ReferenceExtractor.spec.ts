import {connect} from "1e14";
import {
  createReferenceExtractor,
  ReferenceExtractor
} from "./ReferenceExtractor";

describe("createReferenceExtractor()", () => {
  describe("on input (d_model)", () => {
    let node: ReferenceExtractor<{
      name: string;
      person: string;
    }, {
      person: "d_person";
    }>;

    beforeEach(() => {
      node = createReferenceExtractor({
        person: "d_person"
      });
    });

    it("should emit reference IDs on 'd_person'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_person, spy);
      node.i.d_model({
        100: {
          name: "john",
          person: "200"
        },
        101: {
          name: "jane",
          person: "201"
        }
      }, "1");
      expect(spy).toHaveBeenCalledWith(["200", "201"], "1");
    });

    describe("when entries are null", () => {
      it("should skip null entries", () => {
        const spy = jasmine.createSpy();
        connect(node.o.d_person, spy);
        node.i.d_model({
          100: {
            name: "john",
            person: "200"
          },
          101: null
        }, "1");
        expect(spy).toHaveBeenCalledWith(["200"], "1");
      });
    });
  });
});
