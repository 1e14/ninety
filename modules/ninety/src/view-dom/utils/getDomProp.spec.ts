import {getDomProp} from "./getDomProp";
import {setDomProp} from "./setDomProp";

describe("getDomProp()", () => {
  const window = <any>global;

  beforeEach(() => {
    window.Attr = function () {//
    };
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

  describe("for node", () => {
    beforeEach(() => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      setDomProp(cache, path, true);
    });

    it("should return node", () => {
      const cache = {"": window.document};
      expect(getDomProp(cache, "body.childNodes.1:div"))
      .toBe(window.document.body.childNodes[1]);
      expect(getDomProp(cache, "body.childNodes.1:div.childNodes.3:span"))
      .toBe(window.document.body.childNodes[1].childNodes[3]);
    });
  });

  describe("for node list", () => {
    beforeEach(() => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      setDomProp(cache, path, true);
    });

    it("should return childNodes", () => {
      const cache = {"": window.document};
      expect(getDomProp(cache, "body.childNodes"))
      .toBe(window.document.body.childNodes);
      expect(getDomProp(cache, "body.childNodes.1:div.childNodes"))
      .toBe(window.document.body.childNodes[1].childNodes);
    });
  });

  describe("for attribute", () => {
    beforeEach(() => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
      setDomProp(cache, path, "bar");
    });

    it("should return childNodes", () => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
      expect(getDomProp(cache, path)).toBe("bar");
    });
  });

  describe("for CSS class", () => {
    beforeEach(() => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      setDomProp(cache, path, true);
    });

    describe("when present", () => {
      it("should return true", () => {
        const cache = {"": window.document};
        const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
        expect(getDomProp(cache, path)).toBe(true);
      });
    });

    describe("when absent", () => {
      it("should return false", () => {
        const cache = {"": window.document};
        const path = "body.childNodes.1:div.childNodes.3:span.classList.bar";
        expect(getDomProp(cache, path)).toBe(false);
      });
    });
  });

  describe("for style", () => {
    beforeEach(() => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.style.foo";
      setDomProp(cache, path, "bar");
    });

    it("should return style", () => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.style.foo";
      expect(getDomProp(cache, path)).toBe("bar");
    });
  });

  describe("for absent path", () => {
    it("should return undefined", () => {
      const cache = {"": window.document};
      expect(getDomProp(cache, "body.childNodes.1:div")).toBeUndefined();
    });
  });
});
