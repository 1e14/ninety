import {setDomProp} from "./setDomProp";

describe("setDomProp()", () => {
  const window = <any>global;

  beforeEach(() => {
    window.Comment = function () {
      this.parentNode = null;
    };
    window.Text = function () {
      this.parentNode = null;
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
      this.parentNode = null;
    };
    window.Node.prototype = {
      appendChild(newChild: Node) {
        this.childNodes[this.childNodes.length++] = newChild;
        (<any>newChild).parentNode = this;
      },
      replaceChild(newChild, oldChild) {
        for (let i = 0; i < this.childNodes.length; i++) {
          if (this.childNodes[i] === oldChild) {
            this.childNodes[i] = newChild;
            (<any>newChild).parentNode = this;
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

  it("should return true", () => {
    const cache = {"": window.document};
    const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
    expect(setDomProp(cache, path, true)).toBe(true);
  });

  describe("for attribute", () => {
    let cache;

    beforeEach(() => {
      cache = {"": window.document};
    });

    describe("when attribute does not exist yet", () => {
      it("should add new attribute", () => {
        const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
        setDomProp(cache, path, "bar");
        expect(
          window.document.body.childNodes[1].childNodes[3].attributes
          .getNamedItem("foo").value
        ).toBe("bar");
      });
    });

    describe("when attribute already exists", () => {
      beforeEach(() => {
        const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
        setDomProp(cache, path, "bar");
      });

      it("should set attribute value", () => {
        const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
        setDomProp(cache, path, "baz");
        expect(
          window.document.body.childNodes[1].childNodes[3].attributes
          .getNamedItem("foo").value
        ).toBe("baz");
      });
    });
  });

  describe("for CSS class", () => {
    let cache;

    beforeEach(() => {
      cache = {"": window.document};
    });

    it("should add class", () => {
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      setDomProp(cache, path, true);
      expect(
        window.document.body.childNodes[1].childNodes[3].classList.contains("foo")
      ).toBeTruthy();
    });
  });

  describe("for style", () => {
    let cache;

    beforeEach(() => {
      cache = {"": window.document};
    });

    it("should set style property", () => {
      const path = "body.childNodes.1:div.childNodes.3:span.style.foo";
      setDomProp(cache, path, "bar");
      expect(window.document.body.childNodes[1].childNodes[3].style.foo)
      .toBe("bar");
    });
  });

  describe("for event handler", () => {
    let cache;

    beforeEach(() => {
      cache = {"": window.document};
    });

    it("should set handler property", () => {
      const cb = () => null;
      const path = "body.childNodes.1:div.childNodes.3:span.onclick";
      setDomProp(cache, path, cb);
      expect(window.document.body.childNodes[1].childNodes[3].onclick)
      .toBe(cb);
    });
  });

  describe("when unsuccessful", () => {
    let cache;

    beforeEach(() => {
      cache = {"": window.document};
    });

    it("should return false", () => {
      const path = "body.childNodes.1.foo.bar";
      expect(setDomProp(cache, path, true)).toBe(false);
    });
  });
});
