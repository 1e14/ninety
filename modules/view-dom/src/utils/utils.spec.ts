// tslint:disable:no-console
import {prependPaths, setDomProperty} from "./utils";

describe("setDomProperty()", () => {
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
      }
    };
    window.NamedNodeMap = function () {
      this._items = {};
    };
    window.NamedNodeMap.prototype = {
      getNamedItem(name) {
        return this._items[name];
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
      replaceChild: (newChild, oldChild) => null
    };
    window.NodeList = function () {
      this.length = 0;
    };
    window.document = {
      body: new window.Node(),
      createAttribute: (name) => {
        const attr = new window.Attr();
        attr.name = name;
        return attr;
      },
      createComment: (data) => {
        const comment = new window.Comment();
        comment.data = data;
        return comment;
      },
      createElement: (tagName) => {
        const node = new window.Node();
        node.tagName = tagName;
        return node;
      }
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

  describe("for attribute value", () => {
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
      expect(window.document.body.childNodes[1].childNodes[3].style.foo).toBe("bar");
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
