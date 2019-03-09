import {
  applyDomDiff,
  delDomProperty,
  getClosestDomNode,
  getDomProperty,
  setDomProperty
} from "./utils";

const window = <any>global;

beforeEach(() => {
  window.Attr = function () {//
  };
  window.Comment = function () {//
  };
  window.Text = function () {//
  };
  window.CSSStyleDeclaration = function () {//
  };
  window.DOMTokenList = function () {
    this._items = {};
  };
  window.DOMTokenList.prototype = {
    add(name) {
      this._items[name] = name;
    },
    contains(name) {
      return this._items[name] !== undefined;
    },
    remove(name) {
      delete this._items[name];
    }
  };
  window.NamedNodeMap = function () {
    this._items = {};
  };
  window.NamedNodeMap.prototype = {
    getNamedItem(name) {
      return this._items[name];
    },
    removeNamedItem(name) {
      delete this._items[name];
    },
    setNamedItem(attr) {
      this._items[attr.name] = attr;
    }
  };
  window.Node = function () {
    this.childNodes = new window.NodeList();
    this.attributes = new window.NamedNodeMap();
    this.classList = new window.DOMTokenList();
    this.style = new window.CSSStyleDeclaration();
  };
  window.Node.prototype = {
    appendChild(newChild) {
      this.childNodes[this.childNodes.length++] = newChild;
    },
    replaceChild(newChild, oldChild) {
      for (let i = 0; i < this.childNodes.length; i++) {
        if (this.childNodes[i] === oldChild) {
          this.childNodes[i] = newChild;
          break;
        }
      }
    }
  };
  window.NodeList = function () {
    this.length = 0;
  };
  window.document = new Node();
  window.document.body = new window.Node();
  window.document.createAttribute = (name) => {
    const attr = new window.Attr();
    attr.name = name;
    return attr;
  };
  window.document.createComment = (data) => {
    const comment = new window.Comment();
    comment.data = data;
    return comment;
  };
  window.document.createElement = (tagName) => {
    const node = new window.Node();
    node.tagName = tagName;
    return node;
  };
});

afterEach(() => {
  delete window.Attr;
  delete window.Comment;
  delete window.CSSStyleDeclaration;
  delete window.DOMTokenList;
  delete window.NamedNodeMap;
  delete window.Node;
  delete window.NodeList;
  delete window.document;
});

describe("getDomProperty()", () => {
  beforeEach(() => {
    const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
    setDomProperty(path, true);
  });

  it("should return DOM property", () => {
    expect(getDomProperty("body")).toBe(window.document.body);
    expect(getDomProperty("body.childNodes"))
    .toBe(window.document.body.childNodes);
    expect(getDomProperty("body.childNodes.1:div"))
    .toBe(window.document.body.childNodes[1]);
    expect(getDomProperty("body.childNodes.1:div.childNodes"))
    .toBe(window.document.body.childNodes[1].childNodes);
    expect(getDomProperty("body.childNodes.1:div.childNodes.3:span"))
    .toBe(window.document.body.childNodes[1].childNodes[3]);
    expect(getDomProperty("body.childNodes.1:div.childNodes.3:span.classList"))
    .toBe(window.document.body.childNodes[1].childNodes[3].classList);
    expect(getDomProperty("body.childNodes.1:div.childNodes.3:span.classList.foo"))
    .toBe(true);
  });
});

describe("getClosestDomNode()", () => {
  beforeEach(() => {
    const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
    setDomProperty(path, true);
  });

  it("should return closest node", () => {
    expect(getClosestDomNode("body")).toBe(window.document.body);
    expect(getClosestDomNode("body.childNodes"))
    .toBe(window.document.body);
    expect(getClosestDomNode("body.childNodes.1:div"))
    .toBe(window.document.body.childNodes[1]);
    expect(getClosestDomNode("body.childNodes.1:div.childNodes"))
    .toBe(window.document.body.childNodes[1]);
    expect(getClosestDomNode("body.childNodes.1:div.childNodes.3:span"))
    .toBe(window.document.body.childNodes[1].childNodes[3]);
    expect(getClosestDomNode("body.childNodes.1:div.childNodes.3:span.classList"))
    .toBe(window.document.body.childNodes[1].childNodes[3]);
    expect(getClosestDomNode("body.childNodes.1:div.childNodes.3:span.classList.foo"))
    .toBe(window.document.body.childNodes[1].childNodes[3]);
  });
});

describe("setDomProperty()", () => {
  it("should create nodes along the way", () => {
    const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
    setDomProperty(path, true);
    expect(window.document.body.childNodes[1].tagName).toBe("div");
    expect(window.document.body.childNodes[1].childNodes[3].tagName).toBe("span");
  });

  it("should create placeholders along the way", () => {
    const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
    setDomProperty(path, true);
    expect(window.document.body.childNodes[0].data).toBe("");
    expect(window.document.body.childNodes[1].childNodes[0].data).toBe("");
    expect(window.document.body.childNodes[1].childNodes[1].data).toBe("");
    expect(window.document.body.childNodes[1].childNodes[2].data).toBe("");
  });

  it("should return true", () => {
    const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
    expect(setDomProperty(path, true)).toBe(true);
  });

  describe("when comments are in the way", () => {
    beforeEach(() => {
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      setDomProperty(path, true);
    });

    it("should replace comments with nodes", () => {
      const path = "body.childNodes.0:span.innerText";
      setDomProperty(path, "Hello");
      expect(window.document.body.childNodes[0].tagName).toBe("span");
      expect(window.document.body.childNodes[0].innerText).toBe("Hello");
    });
  });

  describe("for attribute", () => {
    describe("when attribute does not exist yet", () => {
      it("should add new attribute", () => {
        const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
        setDomProperty(path, "bar");
        expect(
          window.document.body.childNodes[1].childNodes[3].attributes
          .getNamedItem("foo").value
        ).toBe("bar");
      });
    });

    describe("when attribute already exists", () => {
      beforeEach(() => {
        const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
        setDomProperty(path, "bar");
      });

      it("should set attribute value", () => {
        const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
        setDomProperty(path, "baz");
        expect(
          window.document.body.childNodes[1].childNodes[3].attributes
          .getNamedItem("foo").value
        ).toBe("baz");
      });
    });
  });

  describe("for CSS class", () => {
    it("should add class", () => {
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      setDomProperty(path, true);
      expect(
        window.document.body.childNodes[1].childNodes[3].classList.contains("foo")
      ).toBeTruthy();
    });
  });

  describe("for style", () => {
    it("should set style property", () => {
      const path = "body.childNodes.1:div.childNodes.3:span.style.foo";
      setDomProperty(path, "bar");
      expect(window.document.body.childNodes[1].childNodes[3].style.foo)
      .toBe("bar");
    });
  });

  describe("for event handler", () => {
    it("should set handler property", () => {
      const cb = () => null;
      const path = "body.childNodes.1:div.childNodes.3:span.onclick";
      setDomProperty(path, cb);
      expect(window.document.body.childNodes[1].childNodes[3].onclick)
      .toBe(cb);
    });
  });

  describe("when unsuccessful", () => {
    it("should return false", () => {
      const path = "body.childNodes.1.classList.foo";
      expect(setDomProperty(path, true)).toBe(false);
    });
  });
});

describe("delDomProperty()", () => {
  it("should return true", () => {
    const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
    setDomProperty(path, true);
    const result = delDomProperty(path);
    expect(result).toBe(true);
  });

  describe("for node", () => {
    beforeEach(() => {
      const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
      setDomProperty(path, "bar");
    });

    it("should replace node w/ comment", () => {
      const path = "body.childNodes.1:div.childNodes.3";
      delDomProperty(path);
      const node = window.document.body.childNodes[1].childNodes[3];
      expect(node instanceof window.Comment).toBeTruthy();
    });
  });

  describe("for attribute", () => {
    beforeEach(() => {
      const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
      setDomProperty(path, "bar");
    });

    it("should remove attribute", () => {
      const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
      delDomProperty(path);
      expect(
        window.document.body.childNodes[1].childNodes[3].attributes
        .getNamedItem("foo")
      ).toBeUndefined();
    });
  });

  describe("for CSS class", () => {
    beforeEach(() => {
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      setDomProperty(path, true);
    });

    it("should remove class", () => {
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      delDomProperty(path);
      expect(
        window.document.body.childNodes[1].childNodes[3].classList.contains("foo")
      ).toBeFalsy();
    });
  });

  describe("for style", () => {
    beforeEach(() => {
      const path = "body.childNodes.1:div.childNodes.3:span.style.foo";
      setDomProperty(path, "bar");
    });

    it("should remove class", () => {
      const path = "body.childNodes.1:div.childNodes.3:span.style.foo";
      delDomProperty(path);
      expect(
        window.document.body.childNodes[1].childNodes[3].style.foo
      ).toBe(null);
    });
  });

  describe("for event handler", () => {
    beforeEach(() => {
      const path = "body.childNodes.1:div.childNodes.3:span.onclick";
      setDomProperty(path, () => null);
    });

    it("should reset handler property", () => {
      const path = "body.childNodes.1:div.childNodes.3:span.onclick";
      delDomProperty(path);
      expect(window.document.body.childNodes[1].childNodes[3].onclick)
      .toBe(null);
    });
  });
});

describe("applyDomDiff()", () => {
  describe("when fully applied", () => {
    it("should return true", () => {
      const result = applyDomDiff({
        del: {
          "body.childNodes.1:section": null
        },
        set: {
          "body.childNodes.2:div.attributes.id": "quux"
        }
      });
      expect(result).toBe(true);
    });
  });

  describe("when partially applied", () => {
    it("should return bounced diff", () => {
      const result = applyDomDiff({
        del: {
          // will pass b/c already null
          "body.childNodes.1:section": null
        },
        set: {
          // will pass b/c proper path
          "body.childNodes.2:div.attributes.id": "quux",
          // will NOT pass b/c tagName is missing
          "body.childNodes.4.attributes.bar": "BAZ"
        }
      });
      expect(result).toEqual({
        del: {},
        set: {
          "body.childNodes.4.attributes.bar": "BAZ"
        }
      });
    });
  });
});
