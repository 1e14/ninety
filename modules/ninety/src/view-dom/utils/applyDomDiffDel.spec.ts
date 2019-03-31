import {applyDomDiffDel} from "./applyDomDiffDel";
import * as delDomProp from "./delDomProp";

describe("applyDomDiffDel()", () => {
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

  it("should invoke delDomProp() with correct 'from'", () => {
    const cache = {"": window.document};
    const diffSet = {
      "body.childNodes.0:tr.childNodes.0:td.classList.foo": null,
      "body.childNodes.0:tr.childNodes.1:td.classList.foo": null,
      "body.childNodes.0:tr.childNodes.2:td.classList.foo": null,
      "body.childNodes.1:tr.childNodes.0:td.classList.foo": null,
      "body.childNodes.1:tr.childNodes.1:td.classList.foo": null,
      "body.childNodes.1:tr.childNodes.2:td.classList.foo": null
    };
    const spy = spyOn(delDomProp, "delDomProp").and.returnValue(true);
    applyDomDiffDel(cache, diffSet);
    expect(spy.calls.allArgs()).toEqual([
      [cache, "body.childNodes.0:tr.childNodes.0:td.classList.foo", 0],
      [cache, "body.childNodes.0:tr.childNodes.1:td.classList.foo", 32],
      [cache, "body.childNodes.0:tr.childNodes.2:td.classList.foo", 32],
      [cache, "body.childNodes.1:tr.childNodes.0:td.classList.foo", 16],
      [cache, "body.childNodes.1:tr.childNodes.1:td.classList.foo", 32],
      [cache, "body.childNodes.1:tr.childNodes.2:td.classList.foo", 32]
    ]);
  });

  describe("when delDomProp() returns true", () => {
    it("should return undefined", () => {
      const cache = {"": window.document};
      const diffSet = {
        "body.childNodes.0:tr.childNodes.0:td.classList.foo": null,
        "body.childNodes.0:tr.childNodes.1:td.classList.foo": null,
        "body.childNodes.0:tr.childNodes.2:td.classList.foo": null,
        "body.childNodes.1:tr.childNodes.0:td.classList.foo": null,
        "body.childNodes.1:tr.childNodes.1:td.classList.foo": null,
        "body.childNodes.1:tr.childNodes.2:td.classList.foo": null
      };
      spyOn(delDomProp, "delDomProp").and.returnValue(true);
      expect(applyDomDiffDel(cache, diffSet)).toBeUndefined();
    });
  });

  describe("when delDomProp() returns false", () => {
    it("should return bounced paths", () => {
      const cache = {"": window.document};
      const diffSet = {
        "body.childNodes.0:tr.childNodes.0:td.classList.foo": null,
        "body.childNodes.0:tr.childNodes.1:td.classList.foo": null,
        "body.childNodes.0:tr.childNodes.2:td.classList.foo": null,
        "body.childNodes.1:tr.childNodes.0:td.classList.foo": null,
        "body.childNodes.1:tr.childNodes.1:td.classList.foo": null,
        "body.childNodes.1:tr.childNodes.2:td.classList.foo": null
      };
      spyOn(delDomProp, "delDomProp").and.callFake((a, path) => {
        return path !== "body.childNodes.0:tr.childNodes.2:td.classList.foo";
      });
      expect(applyDomDiffDel(cache, diffSet)).toEqual({
        "body.childNodes.0:tr.childNodes.2:td.classList.foo": null
      });
    });
  });
});
