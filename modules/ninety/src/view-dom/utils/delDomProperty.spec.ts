import {delDomProperty} from "./delDomProperty";
import {setDomProperty} from "./setDomProperty";

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

describe("delDomProperty()", () => {
  it("should return true", () => {
    const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
    setDomProperty(window.document, window.document, path, true);
    const result = delDomProperty(window.document, window.document, path);
    expect(result).toBe(true);
  });

  describe("for node", () => {
    beforeEach(() => {
      const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
      setDomProperty(window.document, window.document, path, "bar");
    });

    it("should replace node w/ comment", () => {
      const path = "body.childNodes.1:div.childNodes.3";
      delDomProperty(window.document, window.document, path);
      const node = window.document.body.childNodes[1].childNodes[3];
      expect(node instanceof window.Comment).toBeTruthy();
    });
  });

  describe("for attribute", () => {
    beforeEach(() => {
      const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
      setDomProperty(window.document, window.document, path, "bar");
    });

    it("should remove attribute", () => {
      const path = "body.childNodes.1:div.childNodes.3:span.attributes.foo";
      delDomProperty(window.document, window.document, path);
      expect(
        window.document.body.childNodes[1].childNodes[3].attributes
        .getNamedItem("foo")
      ).toBeUndefined();
    });
  });

  describe("for CSS class", () => {
    beforeEach(() => {
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      setDomProperty(window.document, window.document, path, true);
    });

    it("should remove class", () => {
      const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
      delDomProperty(window.document, window.document, path);
      expect(
        window.document.body.childNodes[1].childNodes[3].classList.contains("foo")
      ).toBeFalsy();
    });
  });

  describe("for style", () => {
    beforeEach(() => {
      const path = "body.childNodes.1:div.childNodes.3:span.style.foo";
      setDomProperty(window.document, window.document, path, "bar");
    });

    it("should remove class", () => {
      const path = "body.childNodes.1:div.childNodes.3:span.style.foo";
      delDomProperty(window.document, window.document, path);
      expect(
        window.document.body.childNodes[1].childNodes[3].style.foo
      ).toBe(null);
    });
  });

  describe("for event handler", () => {
    beforeEach(() => {
      const path = "body.childNodes.1:div.childNodes.3:span.onclick";
      setDomProperty(window.document, window.document, path, () => null);
    });

    it("should reset handler property", () => {
      const path = "body.childNodes.1:div.childNodes.3:span.onclick";
      delDomProperty(window.document, window.document, path);
      expect(window.document.body.childNodes[1].childNodes[3].onclick)
      .toBe(null);
    });
  });
});
