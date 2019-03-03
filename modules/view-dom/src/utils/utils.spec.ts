import {
  applyDomView,
  delDomProperty,
  prependPaths,
  setDomProperty
} from "./utils";

// tslint:disable:no-var-requires
const utils = require("./utils");

const window = <any>global;

beforeEach(() => {
  window.Attr = function () {//
  };
  window.Comment = function () {//
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
    expect(window.document.body.childNodes[0].data).toBe("ph");
    expect(window.document.body.childNodes[1].childNodes[0].data).toBe("ph");
    expect(window.document.body.childNodes[1].childNodes[1].data).toBe("ph");
    expect(window.document.body.childNodes[1].childNodes[2].data).toBe("ph");
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

describe("applyDomView()", () => {
  it("should return bounced diff", () => {
    const result = applyDomView({
      del: {
        // will pass b/c already null
        "body.childNodes.1:section": null,
        // will not pass b/c property of null
        "body.childNodes.4:section.classList.foo": null
      },
      set: {
        // will pass b/c proper path
        "body.childNodes.2:div.attributes.id": "quux",
        // will NOT pass b/c tagName is missing
        "body.childNodes.4.attributes.bar": "BAZ"
      }
    });
    expect(result).toEqual({
      del: {
        "body.childNodes.4:section.classList.foo": null
      },
      set: {
        "body.childNodes.4.attributes.bar": "BAZ"
      }
    });
  });
});

describe("prependPaths()", () => {
  it("should prepend paths in diff", () => {
    const result = prependPaths({
      del: {
        baz: null,
        foo: null
      },
      set: {
        baz: 1,
        foo: "bar"
      }
    }, "_");
    expect(result).toEqual({
      del: {
        _baz: null,
        _foo: null
      },
      set: {
        _baz: 1,
        _foo: "bar"
      }
    });
  });
});
