import {expandModel} from "./expandModel";

describe("expandModel()", () => {
  it("should expand model", () => {
    const result = expandModel({
      d_model: {
        1: {
          name: "foo",
          person: 4
        },
        2: {
          name: "bar",
          person: 3
        }
      },
      d_person: {
        3: {
          name: "Jane Doe"
        },
        4: {
          name: "John Doe"
        }
      }
    }, {
      d_model: {
        person: "d_person"
      }
    });
    expect(result).toEqual({
      1: {
        name: "foo",
        person: {
          name: "John Doe"
        }
      },
      2: {
        name: "bar",
        person: {
          name: "Jane Doe"
        }
      }
    });
  });

  describe("on absent references", () => {
    it("should assign null to reference", () => {
      const result = expandModel({
        d_model: {
          1: {
            name: "foo",
            person: 4
          },
          2: {
            name: "bar",
            person: 3
          }
        },
        d_person: {
          3: {
            name: "Jane Doe"
          }
        }
      }, {
        d_model: {
          person: "d_person"
        }
      });
      expect(result).toEqual({
        1: {
          name: "foo",
          person: null
        },
        2: {
          name: "bar",
          person: {
            name: "Jane Doe"
          }
        }
      });
    });
  });
});
