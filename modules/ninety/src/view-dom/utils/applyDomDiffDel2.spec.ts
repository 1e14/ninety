import {applyDomDiffDel2} from "./applyDomDiffDel2";
import * as delDomProp2 from "./delDomProp2";

describe("applyDomDiffDel2()", () => {
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
    window.Element = function () {
      window.Node.call(this);
      this.attributes = new window.NamedNodeMap();
      this.classList = new window.DOMTokenList();
    };
    window.Element.prototype = Object.create(window.Node.prototype);
    window.HTMLElement = function () {
      window.Element.call(this);
      this.style = new window.CSSStyleDeclaration();
    };
    window.HTMLElement.prototype = Object.create(window.Element.prototype);
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
      const node = new window.HTMLElement();
      node.tagName = tagName;
      return node;
    };
    window.window = window;
  });

  afterEach(() => {
    delete window.Attr;
    delete window.Comment;
    delete window.CSSStyleDeclaration;
    delete window.DOMTokenList;
    delete window.NamedNodeMap;
    delete window.Node;
    delete window.NodeList;
    delete window.Element;
    delete window.HTMLElement;
    delete window.document;
    delete window.window;
  });

  it("should invoke delDomProp2() with paths", () => {
    const diffSet = {
      "body.childNodes.0:tr.childNodes.0:td.classList.foo": null,
      "body.childNodes.0:tr.childNodes.1:td.classList.foo": null,
      "body.childNodes.0:tr.childNodes.2:td.classList.foo": null,
      "body.childNodes.1:tr.childNodes.0:td.classList.foo": null,
      "body.childNodes.1:tr.childNodes.1:td.classList.foo": null,
      "body.childNodes.1:tr.childNodes.2:td.classList.foo": null
    };
    const spy = spyOn(delDomProp2, "delDomProp2").and.returnValue(true);
    applyDomDiffDel2(diffSet);
    expect(spy.calls.allArgs()).toEqual([
      [[window.document.body], "body.childNodes.0:tr.childNodes.0:td.classList.foo"],
      [[window.document.body], "body.childNodes.0:tr.childNodes.1:td.classList.foo"],
      [[window.document.body], "body.childNodes.0:tr.childNodes.2:td.classList.foo"],
      [[window.document.body], "body.childNodes.1:tr.childNodes.0:td.classList.foo"],
      [[window.document.body], "body.childNodes.1:tr.childNodes.1:td.classList.foo"],
      [[window.document.body], "body.childNodes.1:tr.childNodes.2:td.classList.foo"]
    ]);
  });

  describe("when delDomProp2() returns true", () => {
    it("should return undefined", () => {
      const diffSet = {
        "body.childNodes.0:tr.childNodes.0:td.classList.foo": null,
        "body.childNodes.0:tr.childNodes.1:td.classList.foo": null,
        "body.childNodes.0:tr.childNodes.2:td.classList.foo": null,
        "body.childNodes.1:tr.childNodes.0:td.classList.foo": null,
        "body.childNodes.1:tr.childNodes.1:td.classList.foo": null,
        "body.childNodes.1:tr.childNodes.2:td.classList.foo": null
      };
      spyOn(delDomProp2, "delDomProp2").and.returnValue(true);
      expect(applyDomDiffDel2(diffSet)).toBeUndefined();
    });
  });

  describe("when delDomProp2() returns false", () => {
    it("should return bounced paths", () => {
      const diffSet = {
        "body.childNodes.0:tr.childNodes.0:td.classList.foo": null,
        "body.childNodes.0:tr.childNodes.1:td.classList.foo": null,
        "body.childNodes.0:tr.childNodes.2:td.classList.foo": null,
        "body.childNodes.1:tr.childNodes.0:td.classList.foo": null,
        "body.childNodes.1:tr.childNodes.1:td.classList.foo": null,
        "body.childNodes.1:tr.childNodes.2:td.classList.foo": null
      };
      spyOn(delDomProp2, "delDomProp2").and.callFake((a, path) => {
        return path !== "body.childNodes.0:tr.childNodes.2:td.classList.foo";
      });
      expect(applyDomDiffDel2(diffSet)).toEqual({
        "body.childNodes.0:tr.childNodes.2:td.classList.foo": null
      });
    });
  });
});
