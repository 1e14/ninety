import {connect} from "1e14";
import * as utils from "../utils";
import {createDomDiffApplier, DomDiffApplier} from "./DomDiffApplier";

describe("createDomDiffApplier()", () => {
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
    window.window = window;
    window.requestAnimationFrame = (cb) => cb();
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
    delete window.window;
    delete window.requestAnimationFrame;
  });

  describe("on input (d_diff)", () => {
    let node: DomDiffApplier;

    beforeEach(() => {
      node = createDomDiffApplier();
    });

    it("should invoke applyDomDiff()", () => {
      spyOn(utils, "applyDomDiff");
      const diff = {
        del: {},
        set: {
          "body.childNodes.1:div.classList.foo": true
        }
      };
      node.i.d_diff(diff, "1");
      expect(utils.applyDomDiff).toHaveBeenCalledWith(diff);
    });

    describe("on bounced paths", () => {
      it("should emit on 'b_d_diff'", () => {
        const spy = jasmine.createSpy();
        connect(node.o.b_d_diff, spy);
        const diff = {
          del: {},
          set: {
            "body.childNodes.1.foo.bar": true,
            "body.childNodes.2:div.classList.foo": true
          }
        };
        node.i.d_diff(diff, "1");
        expect(spy).toHaveBeenCalledWith({
          del: {},
          set: {
            "body.childNodes.1.foo.bar": true
          }
        }, "1");
      });
    });
  });
});
