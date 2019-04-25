import {connect} from "1e14";
import {createModelExpander, ModelExpander} from "./ModelExpander";

describe("createModelExpander()", () => {
  type User = {
    name: string,
    person?: string;
  };

  type Person = {
    name: string;
  };

  describe("on input (d_model &...)", () => {
    let node: ModelExpander<{
      d_model: User,
      d_person: Person
    }>;

    beforeEach(() => {
      node = createModelExpander<{
        d_model: User,
        d_person: Person
      }>({
        d_model: {
          person: "d_person"
        },
        // TODO: Shouldn't have to specify non-expanding types
        d_person: null
      });
    });

    it("should emit model on 'd_model'", () => {
      const spy = jasmine.createSpy();
      connect(node.o.d_model, spy);
      node.i.d_model({
        1: {
          name: "foo",
          person: "4"
        },
        2: {
          name: "bar",
          person: "3"
        }
      }, "1");
      node.i.d_person({
        3: {
          name: "Jane Doe"
        },
        4: {
          name: "John Doe"
        }
      }, "1");
      expect(spy).toHaveBeenCalledWith({
        "1.name": "foo",
        "1.person.name": "John Doe",
        "2.name": "bar",
        "2.person.name": "Jane Doe"
      }, "1");
    });
  });
});
