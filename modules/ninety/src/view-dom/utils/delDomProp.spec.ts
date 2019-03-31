import {delDomProp} from "./delDomProp";
import {setDomProp} from "./setDomProp";

describe("delDomProp()", () => {
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

  it("should return true", () => {
    const cache = {"": window.document};
    const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
    setDomProp(cache, path, true);
    expect(delDomProp(cache, path)).toBe(true);
  });

  describe("for node", () => {
    beforeEach(() => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
      setDomProp(cache, path, "bar");
    });

    it("should replace node w/ comment", () => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3";
      delDomProp(cache, path);
      const node = window.document.body.childNodes[1].childNodes[3];
      expect(node instanceof window.Comment).toBeTruthy();
    });
  });

  describe("for attribute", () => {
    beforeEach(() => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
      setDomProp(cache, path, "bar");
    });

    it("should remove attribute", () => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
      delDomProp(cache, path);
      expect(
        window.document.body.childNodes[1].childNodes[3].attributes
        .getNamedItem("foo")
      ).toBeUndefined();
    });
  });

  describe("for CSS class", () => {
    beforeEach(() => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      setDomProp(cache, path, "bar");
    });

    it("should remove class", () => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      delDomProp(cache, path);
      expect(
        window.document.body.childNodes[1].childNodes[3].classList.contains("foo")
      ).toBeFalsy();
    });
  });

  describe("for style", () => {
    beforeEach(() => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.style.foo";
      setDomProp(cache, path, "bar");
    });

    it("should remove class", () => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.style.foo";
      delDomProp(cache, path);
      expect(
        window.document.body.childNodes[1].childNodes[3].style.foo
      ).toBe(null);
    });
  });

  describe("for event handler", () => {
    beforeEach(() => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.onclick";
      setDomProp(cache, path, () => null);
    });

    it("should reset handler property", () => {
      const cache = {"": window.document};
      const path = "body.childNodes.1:div.childNodes.3:span.onclick";
      delDomProp(cache, path);
      expect(window.document.body.childNodes[1].childNodes[3].onclick)
      .toBe(null);
    });
  });
});
