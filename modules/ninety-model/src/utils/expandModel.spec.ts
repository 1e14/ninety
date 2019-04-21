import {expandModel} from "./expandModel";

describe("expandModel()", () => {
  it("should expand model", () => {
    const result = expandModel<{
      d_model: {
        name: string,
        person: string
      },
      d_person: {
        name: string
      }
    }>({
      d_model: {
        1: {
          name: "foo",
          person: "4"
        },
        2: {
          name: "bar",
          person: "3"
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
      },
      d_person: null
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

  describe("for collection references", () => {
    it("should expand collection", () => {
      const result = expandModel<{
        d_model: {
          name: string,
          friends: string
        },
        d_friends: {
          [id: string]: string
        },
        d_friend: {
          name: string
        }
      }>({
        d_friend: {
          7: {
            name: "John Doe"
          },
          8: {
            name: "Jane Doe"
          }
        },
        d_friends: {
          3: {
            5: "7",
            6: "8"
          }
        },
        d_model: {
          1: {
            friends: "4",
            name: "foo"
          },
          2: {
            friends: "3",
            name: "bar"
          }
        }
      }, {
        d_friend: null,
        d_friends: "d_friend",
        d_model: {
          friends: "d_friends"
        }
      });
      expect(result).toEqual({
        1: {
          friends: null,
          name: "foo"
        },
        2: {
          friends: {
            5: {
              name: "John Doe"
            },
            6: {
              name: "Jane Doe"
            }
          },
          name: "bar"
        }
      });
    });
  });
});
