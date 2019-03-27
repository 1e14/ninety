import {getDomProperty} from "./getDomProperty";
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

describe("getDomProperty()", () => {
  beforeEach(() => {
    const path = "body.childNodes.1:div.childNodes.3:span.classList.foo";
    setDomProperty(window.document, window.document, path, true);
  });

  it("should return DOM property and parent", () => {
    expect(getDomProperty("body")).toEqual({
      node: window.document.body,
      property: window.document.body
    });
    expect(getDomProperty("body.childNodes"))
    .toEqual({
      node: window.document.body,
      property: window.document.body.childNodes
    });
    expect(getDomProperty("body.childNodes.1:div"))
    .toEqual({
      node: window.document.body.childNodes[1],
      property: window.document.body.childNodes[1]
    });
    expect(getDomProperty("body.childNodes.1:div.childNodes"))
    .toEqual({
      node: window.document.body.childNodes[1],
      property: window.document.body.childNodes[1].childNodes
    });
    expect(getDomProperty("body.childNodes.1:div.childNodes.3:span"))
    .toEqual({
      node: window.document.body.childNodes[1].childNodes[3],
      property: window.document.body.childNodes[1].childNodes[3]
    });
    expect(getDomProperty("body.childNodes.1:div.childNodes.3:span.classList"))
    .toEqual({
      node: window.document.body.childNodes[1].childNodes[3],
      property: window.document.body.childNodes[1].childNodes[3].classList
    });
    expect(getDomProperty("body.childNodes.1:div.childNodes.3:span.classList.foo"))
    .toEqual({
      node: window.document.body.childNodes[1].childNodes[3],
      property: true
    });
  });
});
