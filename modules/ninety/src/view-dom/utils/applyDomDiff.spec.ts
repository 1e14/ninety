import {applyDomDiff} from "./applyDomDiff";

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

describe("applyDomDiff()", () => {
  describe("when fully applied", () => {
    it("should return undefined", () => {
      const result = applyDomDiff({
        del: {
          "body.childNodes.1:section": null
        },
        set: {
          "body.childNodes.2:div.attributes.id": "quux"
        }
      });
      expect(result).toBe(undefined);
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
