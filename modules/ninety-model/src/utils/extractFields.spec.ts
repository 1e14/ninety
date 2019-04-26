import {extractFields} from "./extractFields";

describe("extractFields()", () => {
  it("should extract references from model", () => {
    const result = extractFields({
      100: {
        author: "200",
        publisher: "300",
        title: "Where the wild things are"
      },
      101: {
        author: "201",
        publisher: "301",
        title: "Left foot, right foot"
      },
      102: {
        author: "202",
        publisher: "302",
        title: "The Gruffalo"
      }
    }, {
      author: "d_author",
      publisher: "d_publisher"
    });
    expect(result).toEqual({
      d_author: ["200", "201", "202"],
      d_publisher: ["300", "301", "302"]
    });
  });

  describe("when entries are null", () => {
    it("should skip null entries", () => {
      const result = extractFields({
        100: {
          author: "200",
          publisher: "300",
          title: "Where the wild things are"
        },
        101: null,
        102: {
          author: "202",
          publisher: "302",
          title: "The Gruffalo"
        }
      }, {
        author: "d_author",
        publisher: "d_publisher"
      });
      expect(result).toEqual({
        d_author: ["200", "202"],
        d_publisher: ["300", "302"]
      });
    });
  });
});
